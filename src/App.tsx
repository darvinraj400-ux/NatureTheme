import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Bookmark, BookmarkCheck, X,
  Leaf, Sprout, Heart, Check, Plus, Minus,
  Edit3, Trash2, ArrowRight, Menu, XIcon, Mail,
  RotateCcw, Eye, Clock, BookOpen,
} from 'lucide-react';
import {
  fieldGuides, categories, collections, fieldNotes, journalArticles,
  impactActivities, type FieldGuide, type Collection,
} from './data/content';
import { saveToStorage, loadFromStorage } from './lib/persistence';
import { calculateImpact, type CalculationResult } from './lib/calculations';

// ============ TYPES ============
interface HabitAction {
  guideId: string;
  day: string | null;
  completed: boolean;
}

interface HabitPlan {
  preferences: { area: string; time: string; style: string; focus: string };
  actions: HabitAction[];
}

interface JournalEntry {
  id: string;
  title: string;
  date: string;
  note: string;
  category: string;
  mood: string;
}

// ============ MAIN APP ============
export default function App() {
  const [savedGuides, setSavedGuides] = useState<string[]>(() => loadFromStorage('saved_guides', []));
  const [habitPlan, setHabitPlan] = useState<HabitPlan | null>(() => loadFromStorage('habit_plan', null));
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => loadFromStorage('journal_entries', []));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<FieldGuide | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    saveToStorage('saved_guides', savedGuides);
  }, [savedGuides]);

  useEffect(() => {
    saveToStorage('habit_plan', habitPlan);
  }, [habitPlan]);

  useEffect(() => {
    saveToStorage('journal_entries', journalEntries);
  }, [journalEntries]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const toggleSaveGuide = useCallback((id: string) => {
    setSavedGuides(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* HEADER */}
      <Header
        scrolled={scrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        scrollToSection={scrollToSection}
        savedCount={savedGuides.length}
      />

      <main id="main-content">
        {/* HERO */}
        <HeroSection scrollToSection={scrollToSection} />

        {/* NATURE DISCOVERY */}
        <NatureDiscoverySection />

        {/* PRINCIPLES */}
        <PrinciplesSection />

        {/* FIELD GUIDE */}
        <FieldGuideSection
          savedGuides={savedGuides}
          toggleSaveGuide={toggleSaveGuide}
          onSelectGuide={setSelectedGuide}
        />

        {/* SEASONAL COLLECTIONS */}
        <CollectionsSection
          savedGuides={savedGuides}
          toggleSaveGuide={toggleSaveGuide}
          onSelectGuide={setSelectedGuide}
        />

        {/* HABIT PLANNER */}
        <HabitPlannerSection
          habitPlan={habitPlan}
          setHabitPlan={setHabitPlan}
          savedGuides={savedGuides}
          onSelectGuide={setSelectedGuide}
        />

        {/* IMPACT EXPLORER */}
        <ImpactExplorerSection />

        {/* NATURE JOURNAL */}
        <NatureJournalSection
          entries={journalEntries}
          setEntries={setJournalEntries}
        />

        {/* FIELD NOTE OF THE DAY */}
        <FieldNoteSection
          savedGuides={savedGuides}
          toggleSaveGuide={toggleSaveGuide}
          onSelectGuide={setSelectedGuide}
        />

        {/* EDITORIAL JOURNAL */}
        <EditorialSection
          savedGuides={savedGuides}
          toggleSaveGuide={toggleSaveGuide}
        />

        {/* OUR APPROACH */}
        <OurApproachSection />

        {/* NEWSLETTER */}
        <NewsletterSection />
      </main>

      {/* FOOTER */}
      <Footer scrollToSection={scrollToSection} />

      {/* GUIDE DETAIL MODAL */}
      <AnimatePresence>
        {selectedGuide && (
          <GuideDetailModal
            guide={selectedGuide}
            onClose={() => setSelectedGuide(null)}
            isSaved={savedGuides.includes(selectedGuide.id)}
            toggleSave={() => toggleSaveGuide(selectedGuide.id)}
            onSelectRelated={(g) => setSelectedGuide(g)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============ HEADER ============
function Header({ scrolled, mobileMenuOpen, setMobileMenuOpen, scrollToSection, savedCount }: {
  scrolled: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  scrollToSection: (id: string) => void;
  savedCount: number;
}) {
  const navItems = [
    { id: 'field-guide', label: 'Field Guide' },
    { id: 'habit-planner', label: 'My Habit Plan' },
    { id: 'nature-journal', label: 'Journal' },
    { id: 'our-approach', label: 'Our Approach' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-paper/95 backdrop-blur-sm border-b border-lichen shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button onClick={() => scrollToSection('home')} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-canopy flex items-center justify-center">
              <Leaf className="w-4 h-4 text-soft-sage" />
            </div>
            <span className="font-display text-lg font-semibold text-canopy hidden sm:block">
              Nature & Sustainability
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-medium text-ink/70 hover:text-canopy transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('field-guide')}
              className="px-5 py-2.5 bg-canopy text-paper text-sm font-medium rounded-full hover:bg-deep-forest transition-colors"
            >
              START YOUR JOURNEY
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-canopy"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-paper border-b border-lichen overflow-hidden"
          >
            <nav className="px-4 py-6 space-y-4" aria-label="Mobile navigation">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left text-lg font-medium text-ink/80 hover:text-canopy py-2"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => scrollToSection('field-guide')}
                className="block w-full text-center px-5 py-3 bg-canopy text-paper font-medium rounded-full"
              >
                START YOUR JOURNEY
              </button>
              {savedCount > 0 && (
                <p className="text-sm text-fern pt-2">
                  <BookmarkCheck className="w-4 h-4 inline mr-1" />
                  {savedCount} saved guide{savedCount !== 1 ? 's' : ''}
                </p>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ============ HERO ============
function HeroSection({ scrollToSection }: { scrollToSection: (id: string) => void }) {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://image.qwenlm.ai/generated-images/18d15e9f-fd6a-4bf7-945b-c6f3dd677c5f/_result.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-forest/80 via-canopy/70 to-deep-forest/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-forest/60 via-transparent to-transparent" />
        {/* Botanical decoration */}
        <svg className="absolute top-20 right-0 w-96 h-96 opacity-10" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="150" stroke="#B8C7A5" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="120" stroke="#B8C7A5" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="90" stroke="#B8C7A5" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="60" stroke="#B8C7A5" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="30" stroke="#B8C7A5" strokeWidth="0.5" />
          <path d="M200 50 Q220 150 200 200 Q180 150 200 50" stroke="#B8C7A5" strokeWidth="0.5" fill="none" />
          <path d="M200 350 Q220 250 200 200 Q180 250 200 350" stroke="#B8C7A5" strokeWidth="0.5" fill="none" />
          <path d="M50 200 Q150 220 200 200 Q150 180 50 200" stroke="#B8C7A5" strokeWidth="0.5" fill="none" />
          <path d="M350 200 Q250 220 200 200 Q250 180 350 200" stroke="#B8C7A5" strokeWidth="0.5" fill="none" />
        </svg>
        {/* Leaf shapes */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-paper to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs tracking-[0.2em] uppercase text-soft-sage mb-6"
          >
            A Field Guide to Living with Nature
          </motion.p>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-paper leading-[1.1] mb-8"
          >
            Closer to nature.
            <br />
            <span className="text-soft-sage">Lighter on the earth.</span>
          </motion.h1>

          {/* Supporting copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl text-mist/80 max-w-xl mb-10 leading-relaxed"
          >
            Discover thoughtful ways to reconnect with the natural world, use what you have, and make everyday life a little more considered.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <button
              onClick={() => scrollToSection('field-guide')}
              className="px-8 py-4 bg-soft-sage text-deep-forest font-semibold rounded-full hover:bg-mist transition-colors text-sm tracking-wide"
            >
              EXPLORE THE FIELD GUIDE
            </button>
            <button
              onClick={() => scrollToSection('habit-planner')}
              className="px-8 py-4 border border-soft-sage/40 text-soft-sage font-medium rounded-full hover:bg-soft-sage/10 transition-colors text-sm tracking-wide"
            >
              BUILD MY HABIT PLAN
            </button>
          </motion.div>

          {/* Label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="font-mono text-xs tracking-[0.3em] uppercase text-soft-sage/60"
          >
            Observe · Learn · Grow
          </motion.p>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-soft-sage/40 rounded-full flex items-start justify-center p-1.5"
        >
          <div className="w-1.5 h-1.5 bg-soft-sage/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============ NATURE DISCOVERY ============
function NatureDiscoverySection() {
  const discoveries = [
    { emoji: '🌱', caption: 'A new leaf unfurling' },
    { emoji: '🪨', caption: 'Moss across stone' },
    { emoji: '☀️', caption: 'Light through foliage' },
    { emoji: '💧', caption: 'Water on a leaf' },
    { emoji: '🌾', caption: 'Seeds and grasses' },
    { emoji: '🍂', caption: 'Autumn decomposition' },
  ];

  return (
    <section className="py-20 lg:py-32 bg-paper contour-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-fern mb-4">Discovery</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-canopy mb-6">
            The natural world is full of small discoveries.
          </h2>
        </motion.div>

        {/* Discovery strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {discoveries.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="aspect-square bg-mist rounded-2xl flex flex-col items-center justify-center p-4 hover:bg-lichen transition-colors"
            >
              <span className="text-4xl mb-3">{d.emoji}</span>
              <p className="text-xs text-ink/60 text-center font-mono">{d.caption}</p>
            </motion.div>
          ))}
        </div>

        {/* Intro statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-lg text-ink/70 leading-relaxed">
            Learning from nature means paying attention to the resources around us, understanding how things grow and decay, and building realistic habits that work with — not against — the natural world.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ============ PRINCIPLES ============
function PrinciplesSection() {
  const principles = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'Notice More',
      description: 'Pay attention to the materials, resources, food, and natural spaces around you. Observation is the foundation of thoughtful action.',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Use What You Have',
      description: 'Repair, maintain, reuse, share, and make thoughtful decisions before replacing something. The most sustainable item is the one you already own.',
    },
    {
      icon: <Sprout className="w-8 h-8" />,
      title: 'Grow at Your Own Pace',
      description: 'Choose practical actions that fit your time, circumstances, budget, and local environment. Progress matters more than perfection.',
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-mist">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-fern mb-4">Guiding Principles</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-canopy mb-6">
            A more thoughtful life begins with paying attention.
          </h2>
          <p className="text-lg text-ink/60 max-w-2xl mx-auto">
            Nature offers countless reminders to observe, adapt, reuse, and work with what already exists. Start small, stay curious, and build habits that make sense for your life.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {principles.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-paper rounded-2xl p-8 lg:p-10 border border-lichen"
            >
              <div className="w-14 h-14 rounded-xl bg-soft-sage/30 flex items-center justify-center text-fern mb-6">
                {p.icon}
              </div>
              <h3 className="font-display text-2xl font-semibold text-canopy mb-3">{p.title}</h3>
              <p className="text-ink/60 leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ FIELD GUIDE ============
function FieldGuideSection({ savedGuides, toggleSaveGuide, onSelectGuide }: {
  savedGuides: string[];
  toggleSaveGuide: (id: string) => void;
  onSelectGuide: (g: FieldGuide) => void;
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'relevance' | 'easiest' | 'name'>('relevance');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = fieldGuides.filter(g => {
    const matchesSearch = search === '' ||
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.summary.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || g.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  }).sort((a, b) => {
    if (sortBy === 'easiest') {
      const order = { Easy: 0, Moderate: 1, Advanced: 2 };
      return order[a.difficulty] - order[b.difficulty];
    }
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    return 0;
  });

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSortBy('relevance');
  };

  const hasActiveFilters = search !== '' || selectedCategory !== 'All' || selectedDifficulty !== 'All';

  return (
    <section id="field-guide" className="py-20 lg:py-32 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-fern mb-4">Field Guide</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-canopy mb-4">
            Explore Practical Guides
          </h2>
          <p className="text-lg text-ink/60 max-w-2xl mx-auto">
            A searchable library of practical ideas for living more closely with the natural world.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
              <input
                type="text"
                placeholder="Search guides..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-mist border border-lichen rounded-xl text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-fern/30"
                aria-label="Search field guides"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 bg-mist border border-lichen rounded-xl text-ink/70 hover:text-canopy transition-colors sm:w-auto"
              aria-expanded={showFilters}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {hasActiveFilters && <span className="w-2 h-2 bg-fern rounded-full" />}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-3 py-4 border-t border-lichen">
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 bg-mist border border-lichen rounded-lg text-sm"
                    aria-label="Filter by category"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select
                    value={selectedDifficulty}
                    onChange={e => setSelectedDifficulty(e.target.value)}
                    className="px-4 py-2 bg-mist border border-lichen rounded-lg text-sm"
                    aria-label="Filter by difficulty"
                  >
                    <option value="All">All Levels</option>
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as typeof sortBy)}
                    className="px-4 py-2 bg-mist border border-lichen rounded-lg text-sm"
                    aria-label="Sort guides"
                  >
                    <option value="relevance">Sort: Relevance</option>
                    <option value="easiest">Sort: Easiest First</option>
                    <option value="name">Sort: A-Z</option>
                  </select>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="px-4 py-2 text-sm text-clay hover:text-bark transition-colors">
                      Clear all
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results count */}
          <p className="text-sm text-ink/50 font-mono">
            {filtered.length} guide{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Guide Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((guide, i) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
                className="group bg-mist/50 border border-lichen rounded-2xl overflow-hidden hover:shadow-lg hover:border-fern/30 transition-all"
              >
                <div className="p-6">
                  {/* Category & Difficulty */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs tracking-wider uppercase text-fern">{guide.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      guide.difficulty === 'Easy' ? 'bg-soft-sage/30 text-fern' :
                      guide.difficulty === 'Moderate' ? 'bg-sand/50 text-bark' :
                      'bg-clay/20 text-clay'
                    }`}>{guide.difficulty}</span>
                  </div>

                  {/* Icon */}
                  <div className="text-3xl mb-3">{guide.image}</div>

                  {/* Title */}
                  <h3 className="font-display text-lg font-semibold text-canopy mb-2 group-hover:text-fern transition-colors">
                    {guide.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-sm text-ink/60 mb-4 line-clamp-2">{guide.summary}</p>

                  {/* Time */}
                  <div className="flex items-center gap-1 text-xs text-ink/40 mb-4">
                    <Clock className="w-3 h-3" />
                    <span>{guide.timeToStart}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onSelectGuide(guide)}
                      className="text-sm font-medium text-fern hover:text-canopy transition-colors flex items-center gap-1"
                    >
                      Read the Guide
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => toggleSaveGuide(guide.id)}
                      className="p-2 rounded-full hover:bg-lichen/50 transition-colors"
                      aria-label={savedGuides.includes(guide.id) ? 'Remove from saved' : 'Save guide'}
                    >
                      {savedGuides.includes(guide.id) ?
                        <BookmarkCheck className="w-4 h-4 text-fern" /> :
                        <Bookmark className="w-4 h-4 text-ink/40" />
                      }
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="font-display text-xl text-canopy mb-2">No guides found</h3>
            <p className="text-ink/60 mb-4">Try adjusting your search or filters.</p>
            <button onClick={clearFilters} className="text-fern hover:text-canopy font-medium text-sm">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ============ COLLECTIONS ============
function CollectionsSection({ savedGuides, toggleSaveGuide, onSelectGuide }: {
  savedGuides: string[];
  toggleSaveGuide: (id: string) => void;
  onSelectGuide: (g: FieldGuide) => void;
}) {
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null);

  return (
    <section id="collections" className="py-20 lg:py-32 forest-texture relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-deep-forest/50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-soft-sage mb-4">Collections</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-paper mb-4">
            Seasonal Nature Collections
          </h2>
          <p className="text-lg text-mist/70 max-w-2xl mx-auto">
            Curated guides organized by theme — each a doorway into a different aspect of living with nature.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col, i) => (
            <motion.button
              key={col.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              onClick={() => setActiveCollection(col)}
              className="text-left bg-canopy/30 backdrop-blur-sm border border-soft-sage/20 rounded-2xl p-6 hover:bg-canopy/50 transition-all group"
            >
              <span className="text-3xl mb-4 block">{col.icon}</span>
              <h3 className="font-display text-xl font-semibold text-paper mb-1 group-hover:text-soft-sage transition-colors">
                {col.title}
              </h3>
              <p className="font-mono text-xs text-soft-sage/70 mb-3">{col.subtitle}</p>
              <p className="text-sm text-mist/60 mb-4">{col.description}</p>
              <span className="text-xs font-mono text-soft-sage/50">{col.guideIds.length} guides →</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Collection Detail Modal */}
      <AnimatePresence>
        {activeCollection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-forest/80 backdrop-blur-sm"
            onClick={() => setActiveCollection(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-paper rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-3xl mb-2 block">{activeCollection.icon}</span>
                  <h3 className="font-display text-2xl font-bold text-canopy">{activeCollection.title}</h3>
                  <p className="font-mono text-xs text-fern mt-1">{activeCollection.subtitle}</p>
                </div>
                <button onClick={() => setActiveCollection(null)} className="p-2 hover:bg-mist rounded-full">
                  <X className="w-5 h-5 text-ink/60" />
                </button>
              </div>
              <p className="text-ink/70 mb-6">{activeCollection.description}</p>
              <div className="space-y-3">
                {activeCollection.guideIds.map((id: string) => {
                  const guide = fieldGuides.find(g => g.id === id);
                  if (!guide) return null;
                  return (
                    <div key={id} className="flex items-center justify-between p-4 bg-mist rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{guide.image}</span>
                        <div>
                          <p className="font-medium text-canopy text-sm">{guide.title}</p>
                          <p className="text-xs text-ink/50">{guide.difficulty} · {guide.timeToStart}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleSaveGuide(guide.id)}
                          className="p-1.5 hover:bg-lichen rounded-full"
                          aria-label="Save guide"
                        >
                          {savedGuides.includes(guide.id) ?
                            <BookmarkCheck className="w-4 h-4 text-fern" /> :
                            <Bookmark className="w-4 h-4 text-ink/40" />
                          }
                        </button>
                        <button
                          onClick={() => { setActiveCollection(null); onSelectGuide(guide); }}
                          className="text-xs text-fern hover:text-canopy font-medium"
                        >
                          Read →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ============ HABIT PLANNER ============
function HabitPlannerSection({ habitPlan, setHabitPlan, savedGuides, onSelectGuide }: {
  habitPlan: HabitPlan | null;
  setHabitPlan: (p: HabitPlan | null) => void;
  savedGuides: string[];
  onSelectGuide: (g: FieldGuide) => void;
}) {
  const [step, setStep] = useState(habitPlan ? 3 : 1);
  const [preferences, setPreferences] = useState(habitPlan?.preferences || { area: '', time: '', style: '', focus: '' });
  const [recommendations, setRecommendations] = useState<FieldGuide[]>([]);

  const generateRecommendations = useCallback(() => {
    let filtered = [...fieldGuides];
    if (preferences.focus) {
      filtered = filtered.filter(g => {
        const focusMap: Record<string, string[]> = {
          home: ['At Home', 'Water & Energy'],
          food: ['Food & Kitchen'],
          outdoor: ['Garden & Outdoors'],
          routines: ['Everyday Travel', 'Digital Habits', 'Shopping & Materials'],
        };
        return focusMap[preferences.focus]?.includes(g.category);
      });
    }
    if (preferences.area && preferences.area !== 'any') {
      filtered = filtered.filter(g => g.category === preferences.area);
    }
    if (preferences.time === 'minimal') {
      filtered = filtered.filter(g => g.difficulty === 'Easy');
    }
    // Sort by relevance and take top 5
    const sorted = filtered.sort(() => Math.random() - 0.5).slice(0, 5);
    setRecommendations(sorted.length > 0 ? sorted : fieldGuides.slice(0, 3));
  }, [preferences]);

  useEffect(() => {
    if (step === 2) generateRecommendations();
  }, [step, generateRecommendations]);

  const addToPlan = (guideId: string) => {
    if (!habitPlan) {
      const newPlan: HabitPlan = {
        preferences,
        actions: [{ guideId, day: null, completed: false }],
      };
      setHabitPlan(newPlan);
    } else {
      if (!habitPlan.actions.find(a => a.guideId === guideId)) {
        setHabitPlan({ ...habitPlan, actions: [...habitPlan.actions, { guideId, day: null, completed: false }] });
      }
    }
    setStep(3);
  };

  const removeFromPlan = (guideId: string) => {
    if (habitPlan) {
      setHabitPlan({ ...habitPlan, actions: habitPlan.actions.filter(a => a.guideId !== guideId) });
    }
  };

  const toggleComplete = (guideId: string) => {
    if (habitPlan) {
      setHabitPlan({
        ...habitPlan,
        actions: habitPlan.actions.map(a => a.guideId === guideId ? { ...a, completed: !a.completed } : a),
      });
    }
  };

  const assignDay = (guideId: string, day: string | null) => {
    if (habitPlan) {
      setHabitPlan({
        ...habitPlan,
        actions: habitPlan.actions.map(a => a.guideId === guideId ? { ...a, day } : a),
      });
    }
  };

  const resetPlan = () => {
    setHabitPlan(null);
    setStep(1);
    setPreferences({ area: '', time: '', style: '', focus: '' });
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const completedCount = habitPlan?.actions.filter(a => a.completed).length || 0;
  const totalCount = habitPlan?.actions.length || 0;

  return (
    <section id="habit-planner" className="py-20 lg:py-32 bg-paper notebook-lines">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-fern mb-4">Habit Planner</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-canopy mb-4">
            My Nature Habit Plan
          </h2>
          <p className="text-lg text-ink/60 max-w-2xl mx-auto">
            Build a personal weekly routine with practical actions that fit your life.
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex items-center gap-2 ${s <= step ? 'text-fern' : 'text-ink/30'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                s <= step ? 'bg-fern text-paper' : 'bg-mist text-ink/40'
              }`}>{s}</div>
              {s < 3 && <div className={`w-8 h-0.5 ${s < step ? 'bg-fern' : 'bg-lichen'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Preferences */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto">
            <div className="bg-mist/50 border border-lichen rounded-2xl p-6 lg:p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-canopy mb-2">Which area interests you most?</label>
                <select
                  value={preferences.focus}
                  onChange={e => setPreferences({ ...preferences, focus: e.target.value })}
                  className="w-full px-4 py-3 bg-paper border border-lichen rounded-xl"
                >
                  <option value="">Select an area...</option>
                  <option value="home">Home & Living</option>
                  <option value="food">Food & Kitchen</option>
                  <option value="outdoor">Outdoor Spaces</option>
                  <option value="routines">Everyday Routines</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-canopy mb-2">How much time per week?</label>
                <select
                  value={preferences.time}
                  onChange={e => setPreferences({ ...preferences, time: e.target.value })}
                  className="w-full px-4 py-3 bg-paper border border-lichen rounded-xl"
                >
                  <option value="">Select time...</option>
                  <option value="minimal">Under 30 minutes</option>
                  <option value="moderate">30-60 minutes</option>
                  <option value="extended">1+ hours</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-canopy mb-2">Preferred style?</label>
                <select
                  value={preferences.style}
                  onChange={e => setPreferences({ ...preferences, style: e.target.value })}
                  className="w-full px-4 py-3 bg-paper border border-lichen rounded-xl"
                >
                  <option value="">Select style...</option>
                  <option value="daily">Small daily habits</option>
                  <option value="weekly">Larger weekend projects</option>
                  <option value="mixed">A mix of both</option>
                </select>
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-canopy text-paper font-medium rounded-xl hover:bg-deep-forest transition-colors"
              >
                Generate My Plan
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Recommendations */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
            <p className="text-center text-ink/60 mb-6">Based on your preferences, here are some recommended actions:</p>
            <div className="space-y-3 mb-8">
              {recommendations.map(guide => (
                <div key={guide.id} className="flex items-center justify-between p-4 bg-mist/50 border border-lichen rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{guide.image}</span>
                    <div>
                      <p className="font-medium text-canopy text-sm">{guide.title}</p>
                      <p className="text-xs text-ink/50">{guide.difficulty} · {guide.timeToStart}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { onSelectGuide(guide); }}
                      className="text-xs text-fern hover:text-canopy"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => addToPlan(guide.id)}
                      className="px-3 py-1.5 bg-fern text-paper text-xs font-medium rounded-lg hover:bg-canopy transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 border border-lichen text-ink/60 rounded-xl hover:bg-mist transition-colors">
                Back
              </button>
              <button onClick={() => setStep(3)} className="flex-1 py-3 bg-canopy text-paper font-medium rounded-xl hover:bg-deep-forest transition-colors">
                View My Plan
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Weekly Plan */}
        {step === 3 && habitPlan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Progress */}
            <div className="bg-mist/50 border border-lichen rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-lg font-semibold text-canopy">Weekly Progress</h3>
                <span className="font-mono text-sm text-fern">{completedCount}/{totalCount} complete</span>
              </div>
              <div className="w-full h-3 bg-lichen rounded-full overflow-hidden">
                <div
                  className="h-full bg-fern rounded-full transition-all duration-500"
                  style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%' }}
                />
              </div>
            </div>

            {/* Day assignments */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {days.map(day => {
                const dayActions = habitPlan.actions.filter(a => a.day === day);
                return (
                  <div key={day} className="bg-mist/30 border border-lichen rounded-xl p-4">
                    <h4 className="font-mono text-xs tracking-wider uppercase text-fern mb-3">{day}</h4>
                    {dayActions.length > 0 ? (
                      <div className="space-y-2">
                        {dayActions.map(action => {
                          const guide = fieldGuides.find(g => g.id === action.guideId);
                          if (!guide) return null;
                          return (
                            <div key={action.guideId} className={`flex items-center gap-2 p-2 rounded-lg ${action.completed ? 'bg-soft-sage/20' : 'bg-paper'}`}>
                              <button
                                onClick={() => toggleComplete(action.guideId)}
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                  action.completed ? 'bg-fern border-fern' : 'border-lichen'
                                }`}
                                aria-label={action.completed ? 'Mark incomplete' : 'Mark complete'}
                              >
                                {action.completed && <Check className="w-3 h-3 text-paper" />}
                              </button>
                              <span className={`text-xs ${action.completed ? 'line-through text-ink/40' : 'text-ink/70'}`}>
                                {guide.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-ink/30 italic">No actions scheduled</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Unscheduled */}
            {habitPlan.actions.filter(a => !a.day).length > 0 && (
              <div className="bg-mist/30 border border-lichen rounded-xl p-4 mb-6">
                <h4 className="font-mono text-xs tracking-wider uppercase text-fern mb-3">Unscheduled</h4>
                <div className="space-y-2">
                  {habitPlan.actions.filter(a => !a.day).map(action => {
                    const guide = fieldGuides.find(g => g.id === action.guideId);
                    if (!guide) return null;
                    return (
                      <div key={action.guideId} className="flex items-center justify-between p-2 bg-paper rounded-lg">
                        <span className="text-sm text-ink/70">{guide.image} {guide.title}</span>
                        <div className="flex items-center gap-2">
                          <select
                            value=""
                            onChange={e => assignDay(action.guideId, e.target.value || null)}
                            className="text-xs px-2 py-1 bg-mist border border-lichen rounded"
                            aria-label={`Assign ${guide.title} to a day`}
                          >
                            <option value="">Assign day...</option>
                            {days.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                          <button onClick={() => removeFromPlan(action.guideId)} className="p-1 text-clay hover:text-bark">
                            <Minus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setStep(2)} className="px-5 py-2.5 border border-lichen text-ink/60 rounded-xl hover:bg-mist text-sm">
                Add More Actions
              </button>
              <button onClick={resetPlan} className="px-5 py-2.5 text-clay hover:text-bark text-sm flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Reset Plan
              </button>
            </div>
            <p className="text-xs text-ink/40 mt-4 font-mono">
              Your plan is saved locally in your browser. It is not shared or synchronized.
            </p>
          </motion.div>
        )}

        {/* No plan yet - show CTA */}
        {step === 3 && !habitPlan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="font-display text-xl text-canopy mb-2">No plan yet</h3>
            <p className="text-ink/60 mb-4">Start by answering a few questions to generate your personal plan.</p>
            <button onClick={() => setStep(1)} className="px-6 py-3 bg-canopy text-paper font-medium rounded-xl hover:bg-deep-forest transition-colors">
              Start Planning
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ============ IMPACT EXPLORER ============
function ImpactExplorerSection() {
  const [selectedActivity, setSelectedActivity] = useState(impactActivities[0].id);
  const [inputValue, setInputValue] = useState('');
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculate = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value) || value < 0) {
      setResult(null);
      return;
    }
    const r = calculateImpact(selectedActivity, value, period);
    setResult(r);
  };

  useEffect(() => {
    calculate();
  }, [selectedActivity, inputValue, period]);

  const activity = impactActivities.find(a => a.id === selectedActivity);

  return (
    <section id="impact" className="py-20 lg:py-32 bg-mist ring-pattern">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-fern mb-4">Impact Explorer</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-canopy mb-4">
            Explore Your Impact
          </h2>
          <p className="text-lg text-ink/60 max-w-2xl mx-auto">
            An educational tool to explore the potential effects of everyday actions. Results are estimates based on activity levels, not measured environmental outcomes.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input panel */}
          <div className="bg-paper border border-lichen rounded-2xl p-6 lg:p-8">
            <h3 className="font-display text-lg font-semibold text-canopy mb-6">Select an Activity</h3>
            <div className="space-y-3 mb-6">
              {impactActivities.map(a => (
                <button
                  key={a.id}
                  onClick={() => { setSelectedActivity(a.id); setInputValue(''); setResult(null); }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedActivity === a.id ? 'border-fern bg-soft-sage/10' : 'border-lichen hover:border-fern/30'
                  }`}
                >
                  <p className="text-sm font-medium text-canopy">{a.name}</p>
                  <p className="text-xs text-ink/50">{a.category}</p>
                </button>
              ))}
            </div>

            {activity && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-canopy mb-2">{activity.inputLabel}</label>
                  <input
                    type="number"
                    min="0"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="Enter a number..."
                    className="w-full px-4 py-3 bg-mist border border-lichen rounded-xl focus:outline-none focus:ring-2 focus:ring-fern/30"
                    aria-label={activity.inputLabel}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-canopy mb-2">Time period</label>
                  <div className="flex gap-2">
                    {(['week', 'month', 'year'] as const).map(p => (
                      <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                          period === p ? 'bg-fern text-paper border-fern' : 'border-lichen text-ink/60 hover:border-fern/30'
                        }`}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results panel */}
          <div className="bg-paper border border-lichen rounded-2xl p-6 lg:p-8">
            <h3 className="font-display text-lg font-semibold text-canopy mb-6">Results</h3>
            {result ? (
              <div className="space-y-4">
                <div className="bg-soft-sage/10 border border-soft-sage/30 rounded-xl p-4">
                  <p className="font-display text-2xl font-bold text-canopy mb-1">{result.result}</p>
                  <p className="text-sm text-ink/60">{result.explanation}</p>
                </div>
                <div className="bg-mist rounded-xl p-4">
                  <h4 className="font-mono text-xs tracking-wider uppercase text-fern mb-2">Assumptions & Limitations</h4>
                  <p className="text-sm text-ink/60">{result.limitations}</p>
                </div>
                <div className="border-t border-lichen pt-4">
                  <p className="text-xs text-ink/40 font-mono">
                    Input: {result.inputValue} {result.inputUnit} · Calculation: activity tracking (not environmental measurement)
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-3xl mb-3">🌱</div>
                <p className="text-ink/50 text-sm">Enter a value to see your estimated activity level.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ NATURE JOURNAL ============
function NatureJournalSection({ entries, setEntries }: {
  entries: JournalEntry[];
  setEntries: (e: JournalEntry[]) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', note: '', category: '', mood: '' });

  const saveEntry = () => {
    if (!form.title.trim()) return;
    if (editingId) {
      setEntries(entries.map(e => e.id === editingId ? { ...e, ...form } : e));
      setEditingId(null);
    } else {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        title: form.title,
        date: new Date().toISOString().split('T')[0],
        note: form.note,
        category: form.category,
        mood: form.mood,
      };
      setEntries([newEntry, ...entries]);
    }
    setForm({ title: '', note: '', category: '', mood: '' });
    setShowForm(false);
  };

  const editEntry = (entry: JournalEntry) => {
    setForm({ title: entry.title, note: entry.note, category: entry.category, mood: entry.mood });
    setEditingId(entry.id);
    setShowForm(true);
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const clearAll = () => {
    if (entries.length === 0) return;
    setEntries([]);
  };

  const journalCategories = ['Plant Observation', 'Habit Tried', 'Repair Completed', 'Garden Task', 'Nature Walk', 'Reflection'];
  const moods = ['☀️ Bright', '🌤 Calm', '🌿 Curious', '🌧 Reflective', '🌱 Growing'];

  return (
    <section id="nature-journal" className="py-20 lg:py-32 bg-paper">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-fern mb-4">Nature Journal</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-canopy mb-4">
            Your Personal Field Notebook
          </h2>
          <p className="text-lg text-ink/60 max-w-2xl mx-auto">
            Record observations, reflections, and experiences. Your journal is stored locally in your browser.
          </p>
        </motion.div>

        {/* Add button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: '', note: '', category: '', mood: '' }); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-canopy text-paper rounded-xl hover:bg-deep-forest transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> New Entry
          </button>
          {entries.length > 0 && (
            <button onClick={clearAll} className="text-sm text-clay hover:text-bark transition-colors">
              Delete all
            </button>
          )}
        </div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-mist/50 border border-lichen rounded-2xl p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-canopy mb-1">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="What did you notice?"
                    className="w-full px-4 py-2.5 bg-paper border border-lichen rounded-xl focus:outline-none focus:ring-2 focus:ring-fern/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-canopy mb-1">Note</label>
                  <textarea
                    value={form.note}
                    onChange={e => setForm({ ...form, note: e.target.value })}
                    placeholder="Write your observation or reflection..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-paper border border-lichen rounded-xl focus:outline-none focus:ring-2 focus:ring-fern/30 resize-none"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-canopy mb-1">Category</label>
                    <select
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-paper border border-lichen rounded-xl"
                    >
                      <option value="">Select...</option>
                      {journalCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-canopy mb-1">Mood</label>
                    <select
                      value={form.mood}
                      onChange={e => setForm({ ...form, mood: e.target.value })}
                      className="w-full px-4 py-2.5 bg-paper border border-lichen rounded-xl"
                    >
                      <option value="">Select...</option>
                      {moods.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={saveEntry} className="px-5 py-2.5 bg-fern text-paper rounded-xl hover:bg-canopy transition-colors text-sm font-medium">
                    {editingId ? 'Update Entry' : 'Save Entry'}
                  </button>
                  <button onClick={() => { setShowForm(false); setEditingId(null); }} className="px-5 py-2.5 border border-lichen text-ink/60 rounded-xl hover:bg-mist text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Entries */}
        {entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map(entry => (
              <motion.div
                key={entry.id}
                layout
                className="bg-mist/30 border border-lichen rounded-xl p-5"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-display text-lg font-semibold text-canopy">{entry.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-mono text-xs text-ink/40">{entry.date}</span>
                      {entry.category && <span className="text-xs px-2 py-0.5 bg-soft-sage/20 text-fern rounded-full">{entry.category}</span>}
                      {entry.mood && <span className="text-xs text-ink/50">{entry.mood}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => editEntry(entry)} className="p-1.5 hover:bg-lichen rounded-full" aria-label="Edit entry">
                      <Edit3 className="w-3.5 h-3.5 text-ink/40" />
                    </button>
                    <button onClick={() => deleteEntry(entry.id)} className="p-1.5 hover:bg-clay/10 rounded-full" aria-label="Delete entry">
                      <Trash2 className="w-3.5 h-3.5 text-clay" />
                    </button>
                  </div>
                </div>
                {entry.note && <p className="text-sm text-ink/60 leading-relaxed">{entry.note}</p>}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-mist/20 rounded-2xl border border-lichen/50">
            <div className="text-3xl mb-3">📓</div>
            <p className="text-ink/50 text-sm">Your journal is empty. Start by recording an observation.</p>
          </div>
        )}

        <p className="text-xs text-ink/40 mt-4 font-mono">
          All entries are stored locally in your browser. Nothing is uploaded or shared.
        </p>
      </div>
    </section>
  );
}

// ============ FIELD NOTE OF THE DAY ============
function FieldNoteSection({ savedGuides, toggleSaveGuide, onSelectGuide }: {
  savedGuides: string[];
  toggleSaveGuide: (id: string) => void;
  onSelectGuide: (g: FieldGuide) => void;
}) {
  // Deterministic by date
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % fieldNotes.length;
  const note = fieldNotes[dayIndex];
  const relatedGuide = fieldGuides.find(g => g.id === note.relatedGuideId);

  return (
    <section className="py-20 lg:py-32 bg-mist">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-paper border border-lichen rounded-2xl p-8 lg:p-12 relative overflow-hidden"
        >
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
            <svg viewBox="0 0 100 100" fill="none">
              <path d="M100 0 Q50 30 30 100" stroke="#52775A" strokeWidth="1" />
              <path d="M100 20 Q60 40 40 100" stroke="#52775A" strokeWidth="0.5" />
              <path d="M80 0 Q50 20 20 100" stroke="#52775A" strokeWidth="0.5" />
            </svg>
          </div>

          <p className="font-mono text-xs tracking-[0.2em] uppercase text-fern mb-4">Field Note of the Day</p>
          <h3 className="font-display text-2xl lg:text-3xl font-bold text-canopy mb-4">{note.title}</h3>
          <p className="text-lg text-ink/70 mb-3 italic">"{note.observation}"</p>
          <p className="text-ink/60 mb-6 leading-relaxed">{note.explanation}</p>

          <div className="flex flex-wrap items-center gap-4">
            {relatedGuide && (
              <button
                onClick={() => onSelectGuide(relatedGuide)}
                className="flex items-center gap-2 text-sm font-medium text-fern hover:text-canopy transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Related: {relatedGuide.title}
              </button>
            )}
            <button
              onClick={() => relatedGuide && toggleSaveGuide(relatedGuide.id)}
              className="px-4 py-2 bg-canopy text-paper text-sm font-medium rounded-full hover:bg-deep-forest transition-colors"
            >
              TRY THIS
            </button>
          </div>

          <p className="font-mono text-xs text-ink/30 mt-6">{note.date}</p>
        </motion.div>
      </div>
    </section>
  );
}

// ============ EDITORIAL SECTION ============
function EditorialSection({ savedGuides, toggleSaveGuide }: {
  savedGuides: string[];
  toggleSaveGuide: (id: string) => void;
}) {
  return (
    <section id="journal" className="py-20 lg:py-32 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-fern mb-4">Journal</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-canopy mb-4">
            Nature Journal & Stories
          </h2>
          <p className="text-lg text-ink/60 max-w-2xl mx-auto">
            Longer-form articles exploring our relationship with the natural world.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {journalArticles.map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-mist/30 border border-lichen rounded-2xl overflow-hidden group"
            >
              <div className="p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{article.image}</span>
                  <div>
                    <span className="font-mono text-xs tracking-wider uppercase text-fern">{article.category}</span>
                    <span className="text-xs text-ink/40 ml-2">{article.readingTime}</span>
                  </div>
                </div>
                <h3 className="font-display text-xl font-semibold text-canopy mb-3 group-hover:text-fern transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-ink/60 mb-4 leading-relaxed">{article.introduction}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {article.takeaways.slice(0, 2).map((t, j) => (
                      <span key={j} className="text-xs px-2 py-0.5 bg-soft-sage/20 text-fern rounded-full">{t.slice(0, 30)}...</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ OUR APPROACH ============
function OurApproachSection() {
  return (
    <section id="our-approach" className="py-20 lg:py-32 forest-texture relative">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-forest/50 to-canopy/50" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-soft-sage mb-4">Our Approach</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-paper mb-8">
            A closer relationship with nature starts with paying attention.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 mt-12">
          {[
            { title: 'Practicality over perfection', desc: 'Small, consistent actions matter more than dramatic gestures that are hard to maintain.' },
            { title: 'Curiosity over judgment', desc: 'Learning and exploring work better than guilt or shame as motivators for change.' },
            { title: 'Thoughtful consumption', desc: 'Questioning whether we truly need something before acquiring it is the most direct form of impact reduction.' },
            { title: 'Repair and maintenance', desc: 'Keeping what we have working well is almost always more resource-efficient than replacing it.' },
            { title: 'Respect for local ecosystems', desc: 'Environmental decisions depend on local conditions, infrastructure, and circumstances.' },
            { title: 'Honest communication', desc: 'We acknowledge uncertainty, avoid fabricated statistics, and distinguish between activity tracking and measured outcomes.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-canopy/30 backdrop-blur-sm border border-soft-sage/20 rounded-xl p-6"
            >
              <h3 className="font-display text-lg font-semibold text-paper mb-2">{item.title}</h3>
              <p className="text-sm text-mist/70">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-mist/50 text-sm mt-12 max-w-xl mx-auto"
        >
          We do not claim to be carbon-neutral, zero-waste, or certified sustainable. We aim to provide honest, practical information that helps people make more considered choices within their own circumstances.
        </motion.p>
      </div>
    </section>
  );
}

// ============ NEWSLETTER ============
function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <section className="py-20 lg:py-32 bg-paper contour-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-soft-sage/20 flex items-center justify-center">
            <Mail className="w-7 h-7 text-fern" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-canopy mb-4">
            A little more nature in your everyday.
          </h2>
          <p className="text-lg text-ink/60 mb-8 max-w-xl mx-auto">
            Receive thoughtful field notes, useful guides, and practical ideas for living more closely with the natural world.
          </p>

          {submitted ? (
            <div className="bg-soft-sage/10 border border-soft-sage/30 rounded-xl p-6">
              <Check className="w-8 h-8 text-fern mx-auto mb-2" />
              <p className="text-canopy font-medium">Thank you for your interest!</p>
              <p className="text-sm text-ink/50 mt-1">This is a demonstration — no email has been subscribed to a real mailing list.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 bg-mist border border-lichen rounded-xl focus:outline-none focus:ring-2 focus:ring-fern/30"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-canopy text-paper font-medium rounded-xl hover:bg-deep-forest transition-colors"
                >
                  Subscribe
                </button>
              </div>
              {error && <p className="text-sm text-clay mt-2 text-left">{error}</p>}
              <p className="text-xs text-ink/40 mt-3">This is a demonstration. No data is collected or stored.</p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ============ FOOTER ============
function Footer({ scrollToSection }: { scrollToSection: (id: string) => void }) {
  return (
    <footer className="bg-deep-forest text-mist/70 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-fern/30 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-soft-sage" />
              </div>
              <span className="font-display text-lg font-semibold text-paper">Nature & Sustainability</span>
            </div>
            <p className="text-sm text-mist/50">
              A field guide to living more closely with the natural world.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-xs tracking-wider uppercase text-soft-sage mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><button onClick={() => scrollToSection('field-guide')} className="text-sm hover:text-paper transition-colors">Field Guide</button></li>
              <li><button onClick={() => scrollToSection('collections')} className="text-sm hover:text-paper transition-colors">Collections</button></li>
              <li><button onClick={() => scrollToSection('habit-planner')} className="text-sm hover:text-paper transition-colors">Habit Planner</button></li>
              <li><button onClick={() => scrollToSection('nature-journal')} className="text-sm hover:text-paper transition-colors">Nature Journal</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs tracking-wider uppercase text-soft-sage mb-4">Learn</h4>
            <ul className="space-y-2">
              <li><button onClick={() => scrollToSection('impact')} className="text-sm hover:text-paper transition-colors">Impact Explorer</button></li>
              <li><button onClick={() => scrollToSection('journal')} className="text-sm hover:text-paper transition-colors">Editorial Journal</button></li>
              <li><button onClick={() => scrollToSection('our-approach')} className="text-sm hover:text-paper transition-colors">Our Approach</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs tracking-wider uppercase text-soft-sage mb-4">Philosophy</h4>
            <p className="text-sm text-mist/50 leading-relaxed">
              Practicality over perfection. Curiosity over judgment. Thoughtful action over performative gestures.
            </p>
          </div>
        </div>
        <div className="border-t border-soft-sage/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-mist/30">
            © {new Date().getFullYear()} Nature & Sustainability. Built with care for the living world.
          </p>
          <p className="font-mono text-xs text-mist/20">
            OBSERVE · LEARN · GROW
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============ GUIDE DETAIL MODAL ============
function GuideDetailModal({ guide, onClose, isSaved, toggleSave, onSelectRelated }: {
  guide: FieldGuide;
  onClose: () => void;
  isSaved: boolean;
  toggleSave: () => void;
  onSelectRelated: (g: FieldGuide) => void;
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const relatedGuides = guide.relatedIds.map(id => fieldGuides.find(g => g.id === id)).filter(Boolean) as FieldGuide[];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-deep-forest/80 backdrop-blur-sm p-4 pt-20"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-paper rounded-2xl max-w-3xl w-full my-8 overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={guide.title}
      >
        {/* Header */}
        <div className="bg-mist border-b border-lichen p-6 lg:p-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{guide.image}</span>
                <div>
                  <span className="font-mono text-xs tracking-wider uppercase text-fern">{guide.category}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      guide.difficulty === 'Easy' ? 'bg-soft-sage/30 text-fern' :
                      guide.difficulty === 'Moderate' ? 'bg-sand/50 text-bark' :
                      'bg-clay/20 text-clay'
                    }`}>{guide.difficulty}</span>
                    <span className="text-xs text-ink/40 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {guide.timeToStart}
                    </span>
                  </div>
                </div>
              </div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-canopy">{guide.title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleSave} className="p-2 hover:bg-lichen rounded-full" aria-label={isSaved ? 'Remove from saved' : 'Save guide'}>
                {isSaved ? <BookmarkCheck className="w-5 h-5 text-fern" /> : <Bookmark className="w-5 h-5 text-ink/40" />}
              </button>
              <button onClick={onClose} className="p-2 hover:bg-lichen rounded-full" aria-label="Close">
                <X className="w-5 h-5 text-ink/60" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Why it matters */}
          <div>
            <h3 className="font-display text-lg font-semibold text-canopy mb-2">Why This Matters</h3>
            <p className="text-ink/70 leading-relaxed">{guide.whyItMatters}</p>
          </div>

          {/* What you need */}
          <div>
            <h3 className="font-display text-lg font-semibold text-canopy mb-2">What You'll Need</h3>
            <ul className="space-y-1">
              {guide.whatYouNeed.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-ink/60">
                  <div className="w-1.5 h-1.5 bg-fern rounded-full flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div>
            <h3 className="font-display text-lg font-semibold text-canopy mb-3">Step by Step</h3>
            <ol className="space-y-3">
              {guide.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-soft-sage/30 text-fern text-xs font-medium rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-sm text-ink/70 pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Common mistakes */}
          <div>
            <h3 className="font-display text-lg font-semibold text-canopy mb-2">Common Mistakes</h3>
            <ul className="space-y-1">
              {guide.commonMistakes.map((mistake, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink/60">
                  <span className="text-clay mt-0.5">•</span>
                  {mistake}
                </li>
              ))}
            </ul>
          </div>

          {/* Safety notes */}
          {guide.safetyNotes && (
            <div className="bg-sand/10 border border-sand/30 rounded-xl p-4">
              <h3 className="font-display text-sm font-semibold text-bark mb-1">Safety Note</h3>
              <p className="text-sm text-ink/60">{guide.safetyNotes}</p>
            </div>
          )}

          {/* First step */}
          <div className="bg-soft-sage/10 border border-soft-sage/30 rounded-xl p-4">
            <h3 className="font-mono text-xs tracking-wider uppercase text-fern mb-1">First Step</h3>
            <p className="text-ink/70">{guide.firstStep}</p>
          </div>

          {/* Next step */}
          <div>
            <h3 className="font-display text-lg font-semibold text-canopy mb-2">Suggested Next Step</h3>
            <p className="text-sm text-ink/60">{guide.nextStep}</p>
          </div>

          {/* Related guides */}
          {relatedGuides.length > 0 && (
            <div>
              <h3 className="font-display text-lg font-semibold text-canopy mb-3">Related Guides</h3>
              <div className="flex flex-wrap gap-2">
                {relatedGuides.map(rg => (
                  <button
                    key={rg.id}
                    onClick={() => onSelectRelated(rg)}
                    className="flex items-center gap-2 px-3 py-2 bg-mist border border-lichen rounded-lg hover:border-fern/30 transition-colors text-sm"
                  >
                    <span>{rg.image}</span>
                    <span className="text-canopy">{rg.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
