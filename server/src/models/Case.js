import mongoose from 'mongoose';
import crypto from 'node:crypto';

// Standard Mongoose Schema definition
const SuspectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  relationship: { type: String, required: true },
  alibi: { type: String, required: true },
  motive: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  isCulprit: { type: Boolean, default: false, select: false }
}, { _id: false });

const ClueSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  isDiscovered: { type: Boolean, default: false },
  discoveredAt: { type: Date, default: null }
}, { _id: false });

const HintSchema = new mongoose.Schema({
  id: { type: String, required: true },
  content: { type: String, required: true },
  isUsed: { type: Boolean, default: false },
  usedAt: { type: Date, default: null }
}, { _id: false });

const CaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  story: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  premise: { type: String, required: true },
  suspects: [SuspectSchema],
  clues: [ClueSchema],
  hints: [HintSchema],
  culpritId: { type: String, required: true, select: false },
  culpritName: { type: String, required: true, select: false },
  solution: { type: String, required: true, select: false },
  status: { type: String, enum: ['active', 'solved', 'failed'], default: 'active' },
  playerAccusation: {
    suspectId: { type: String, default: null },
    deduction: { type: String, default: '' },
    accusedAt: { type: Date, default: null }
  },
  score: {
    basePoints: { type: Number, default: 0 },
    clueBonus: { type: Number, default: 0 },
    hintPenalty: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

// Security redaction method
CaseSchema.methods.toActiveView = function() {
  const obj = typeof this.toObject === 'function' ? this.toObject() : JSON.parse(JSON.stringify(this));
  
  delete obj.culpritId;
  delete obj.culpritName;
  delete obj.solution;

  obj.clues = (obj.clues || []).map(c => ({
    id: c.id,
    title: c.title,
    location: c.location,
    isDiscovered: Boolean(c.isDiscovered),
    discoveredAt: c.discoveredAt,
    description: c.isDiscovered ? c.description : '[EVIDENCE UNEXAMINED - Click to inspect crime scene]'
  }));

  obj.hints = (obj.hints || []).map(h => ({
    id: h.id,
    isUsed: Boolean(h.isUsed),
    usedAt: h.usedAt,
    content: h.isUsed ? h.content : '[HINT LOCKED - Request Precinct Guidance]'
  }));

  if (obj.suspects) {
    obj.suspects = obj.suspects.map(s => {
      const copy = { ...s };
      delete copy.isCulprit;
      return copy;
    });
  }

  return obj;
};

const MongooseCaseModel = mongoose.models.Case || mongoose.model('Case', CaseSchema);

// In-Memory Fallback Store (active if live MongoDB is unreachable in development/testing)
const inMemoryCases = new Map();

class InMemoryCaseDocument {
  constructor(data) {
    Object.assign(this, JSON.parse(JSON.stringify(data)));
    if (!this._id) {
      this._id = crypto.randomBytes(12).toString('hex');
    }
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
  }

  toObject() {
    return JSON.parse(JSON.stringify(this));
  }

  toActiveView() {
    return CaseSchema.methods.toActiveView.call(this);
  }

  async save() {
    inMemoryCases.set(String(this._id), this);
    return this;
  }
}

// Unified Proxy Model that routes to Mongoose if connected, or InMemoryStore if disconnected
export const Case = function(data) {
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return new MongooseCaseModel(data);
  }
  return new InMemoryCaseDocument(data);
};

// Static methods
Case.findById = function(id) {
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return MongooseCaseModel.findById(id);
  }

  const found = inMemoryCases.get(String(id));
  const doc = found ? new InMemoryCaseDocument(found) : null;

  // Provide chainable .select() support matching Mongoose Query
  const chainable = {
    select: function() {
      return Promise.resolve(doc);
    },
    then: function(resolve, reject) {
      return Promise.resolve(doc).then(resolve, reject);
    }
  };

  return chainable;
};

Case.find = function() {
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return MongooseCaseModel.find();
  }

  const all = Array.from(inMemoryCases.values()).map(c => new InMemoryCaseDocument(c));

  const chainable = {
    sort: function() {
      all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return this;
    },
    limit: function(n) {
      const sliced = all.slice(0, n);
      return {
        select: () => Promise.resolve(sliced),
        then: (resolve, reject) => Promise.resolve(sliced).then(resolve, reject)
      };
    },
    select: function() {
      return Promise.resolve(all);
    },
    then: function(resolve, reject) {
      return Promise.resolve(all).then(resolve, reject);
    }
  };

  return chainable;
};

export default Case;
