import React, { useState } from 'react';
import { 
  Ruler, 
  Zap, 
  TestTube, 
  GraduationCap, 
  Globe, 
  Users, 
  Clock, 
  Search, 
  Plus,
  X,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

export default function SubjectsGrid() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null); // សម្រាប់ Modal មើលលម្អិត
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // សម្រាប់ Modal បន្ថែមមុខវិជ្ជា

  // ទិន្នន័យ Form បន្ថែមមុខវិជ្ជាថ្មី
  const [newSubject, setNewSubject] = useState({
    code: '',
    titleKh: '',
    titleEn: '',
    teacher: '',
    hours: '៤ ម៉ោង/សប្ដាហ៍',
    credits: '៣ អ៊ិនធុក្រេឌីត',
  });

  // ទិន្នន័យមុខវិជ្ជា
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      code: 'MATH12',
      titleKh: 'គណិតវិទ្យា',
      titleEn: 'Mathematics',
      teacher: 'លោកគ្រូ សុខ ពិសិដ្ឋ',
      hours: '៦ ម៉ោង/សប្ដាហ៍',
      credits: '៤ អ៊ិនធុក្រេឌីត',
      icon: Ruler,
      bgColor: 'bg-blue-950/40',
      iconColor: 'text-blue-400',
      description: 'សិក្សាអំពីលីមីត ដេរីវេ អាំងតេក្រាល សមីការឌីផេរ៉ង់ស្យែល និងធរណីមាត្រក្នុងលំហ។',
      topics: ['លីមីតនៃអនុគមន៍', 'ដេរីវេ និងការអនុវត្ត', 'អាំងតេក្រាល', 'ចំនួនកុំផ្លិច', 'ធរណីមាត្រក្នុងលំហ']
    },
    {
      id: 2,
      code: 'KHM12',
      titleKh: 'អក្សរសាស្ត្រខ្មែរ',
      titleEn: 'Khmer Literature',
      teacher: 'អ្នកគ្រូ ចាន់ សុធារី',
      hours: '៤ ម៉ោង/សប្ដាហ៍',
      credits: '៣ អ៊ិនធុក្រេឌីត',
      iconText: 'KH',
      bgColor: 'bg-amber-950/40',
      iconColor: 'text-amber-500',
      description: 'សិក្សាអំពីការវិភាគអក្សរសិល្ប៍ តែងសេចក្ដី អរិយធម៌ខ្មែរ និងវេយ្យាករណ៍កម្រិតខ្ពស់។',
      topics: ['រឿងទុំទាវ', 'រឿងកុលាបប៉ៃលិន', 'វិធីសាស្ត្រតែងសេចក្ដី', 'ភាសាវិទ្យា និងវេយ្យាករណ៍']
    },
    {
      id: 3,
      code: 'PHY12',
      titleKh: 'រូបវិទ្យា',
      titleEn: 'Physics',
      teacher: 'លោកគ្រូ គឹម ហុង',
      hours: '៤ ម៉ោង/សប្ដាហ៍',
      credits: '៣ អ៊ិនធុក្រេឌីត',
      icon: Zap,
      bgColor: 'bg-yellow-950/40',
      iconColor: 'text-yellow-400',
      description: 'សិក្សាអំពីមេកានិច រលក អគ្គិសនី ម៉ាញេទិច និងរូបវិទ្យានុយក្លេអ៊ែរ។',
      topics: ['ចលនាស្យង់ស្យុង', 'រលកមេកានិច', 'អគ្គិសនីចរន្តឆ្លាស់', 'រូបវិទ្យានុយក្លេអ៊ែរ']
    },
    {
      id: 4,
      code: 'CHM12',
      titleKh: 'គីមីវិទ្យា',
      titleEn: 'Chemistry',
      teacher: 'អ្នកគ្រូ លី គឹមអេង',
      hours: '៤ ម៉ោង/សប្ដាហ៍',
      credits: '៣ អ៊ិនធុក្រេឌីត',
      icon: TestTube,
      bgColor: 'bg-emerald-950/40',
      iconColor: 'text-emerald-400',
      description: 'សិក្សាអំពីគីមីសរីរាង្គ ស៊ីនេទិចគីមី លំនឹងគីមី និងអាស៊ីត-បាស។',
      topics: ['ល្បឿនប្រប្រតិកម្មគីមី', 'លំនឹងគីមី', 'សូលុយស្យុងអាស៊ីត-បាស', 'សមាសធាតុសរីរាង្គ']
    },
    {
      id: 5,
      code: 'BIO12',
      titleKh: 'ជីវវិទ្យា',
      titleEn: 'Biology',
      teacher: 'លោកគ្រូ ហេង សម្បត្តិ',
      hours: '៣ ម៉ោង/សប្ដាហ៍',
      credits: '៣ អ៊ិនធុក្រេឌីត',
      icon: GraduationCap,
      bgColor: 'bg-teal-950/40',
      iconColor: 'text-teal-400',
      description: 'សិក្សាអំពីពន្ធុវិទ្យា ADN/ARN ការសំយោគប្រូតេអ៊ីន និងអេកូឡូស៊ី។',
      topics: ['ពន្ធុវិទ្យាម៉ូលេគុល', 'ការបន្តពូជរបស់រុក្ខជាតិ/សត្វ', 'ការវិវត្តនៃសត្វ', 'អេកូឡូស៊ី']
    },
    {
      id: 6,
      code: 'ENG12',
      titleKh: 'ភាសាអង់គ្លេស',
      titleEn: 'English Language',
      teacher: 'Mr. David Smith',
      hours: '៣ ម៉ោង/សប្ដាហ៍',
      credits: '២ អ៊ិនធុក្រេឌីត',
      icon: Globe,
      bgColor: 'bg-purple-950/40',
      iconColor: 'text-purple-400',
      description: 'ការអភិវឌ្ឍជំនាញអាន សរសេរ ស្ដាប់ និងនិយាយកម្រិត Upper-Intermediate (B2)។',
      topics: ['Academic Writing', 'Grammar in Context', 'Listening Comprehension', 'Public Speaking']
    },
  ]);

  // តម្រងស្វែងរកមុខវិជ្ជា
  const filteredSubjects = subjects.filter((subject) =>
    subject.titleKh.includes(searchQuery) ||
    subject.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // រក្សាទុកមុខវិជ្ជាថ្មី
  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubject.titleKh || !newSubject.code) return;

    const created = {
      id: Date.now(),
      ...newSubject,
      icon: BookOpen,
      bgColor: 'bg-indigo-950/40',
      iconColor: 'text-indigo-400',
      description: 'មុខវិជ្ជាទើបតែបានបន្ថែមថ្មីទៅក្នុងប្រព័ន្ធ។',
      topics: ['មេរៀនទី១', 'មេរៀនទី២', 'មេរៀនទី៣']
    };

    setSubjects([created, ...subjects]);
    setIsAddModalOpen(false);
    setNewSubject({ code: '', titleKh: '', titleEn: '', teacher: '', hours: '៤ ម៉ោង/សប្ដាហ៍', credits: '៣ អ៊ិនធុក្រេឌីត' });
  };

  return (
    <div className="flex-1 bg-[#0b0f17] text-slate-200 p-8 font-['Kantumruy_Pro',sans-serif] min-h-screen relative">
      
      {/* ផ្នែក Header ខាងលើ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/60">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            មុខវិជ្ជា & កម្មវិធីសិក្សា
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            បញ្ជីមុខវិជ្ជាសិក្សា និងព័ត៌មានលម្អិតនៃកម្មវិធីសិក្សាថ្នាក់ទី១២
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* ប្រអប់ស្វែងរក */}
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ស្វែងរកមុខវិជ្ជា..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#131924] text-slate-200 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-800/80 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
            />
          </div>

          {/* ប៊ូតុងបន្ថែមមុខវិជ្ជា (ចុចបើក Modal បន្ថែម) */}
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>បន្ថែមមុខវិជ្ជា</span>
          </button>
        </div>
      </div>

      {/* Grid កាតមុខវិជ្ជា (អាចចុចពីលើបាន cursor-pointer) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => {
          const IconComponent = subject.icon;
          return (
            <div
              key={subject.id}
              onClick={() => setSelectedSubject(subject)}
              className="bg-[#111723] border border-slate-800/80 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-200 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* ផ្នែកក្បាលកាត */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl ${subject.bgColor} flex items-center justify-center border border-slate-700/30 group-hover:scale-105 transition-transform`}>
                    {IconComponent ? (
                      <IconComponent className={`w-6 h-6 ${subject.iconColor}`} />
                    ) : (
                      <span className={`font-bold text-base ${subject.iconColor}`}>
                        {subject.iconText}
                      </span>
                    )}
                  </div>
                  <span className="px-3 py-1 bg-[#1a2332] text-blue-400 text-xs font-semibold rounded-lg border border-slate-800/80 group-hover:border-blue-500/30">
                    {subject.code}
                  </span>
                </div>

                {/* ចំណងជើងមុខវិជ្ជា */}
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                  {subject.titleKh}{' '}
                  <span className="text-slate-400 font-normal text-sm">
                    ({subject.titleEn})
                  </span>
                </h3>

                {/* គ្រូបង្រៀន */}
                <div className="flex items-center gap-2 mt-2 text-sm text-slate-400">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>
                    បង្រៀនដោយ៖{' '}
                    <span className="text-slate-300 font-medium">
                      {subject.teacher}
                    </span>
                  </span>
                </div>
              </div>

              {/* បាតកាត (ម៉ោងសិក្សា & កេឌីត) */}
              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>{subject.hours}</span>
                </div>
                <span className="px-2.5 py-1 bg-[#1a2332] text-slate-300 rounded-md font-medium border border-slate-800/60">
                  {subject.credits}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ----------------1. MODAL មើលព័ត៌មានលម្អិត (នៅពេលចុចលើកាត) ---------------- */}
      {selectedSubject && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111723] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/20">
                  {selectedSubject.code}
                </span>
                <h3 className="text-lg font-bold text-white">{selectedSubject.titleKh}</h3>
              </div>
              <button 
                onClick={() => setSelectedSubject(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">ការពិពណ៌នាមុខវិជ្ជា</p>
                <p className="text-sm text-slate-300 leading-relaxed">{selectedSubject.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-[#1a2332] p-4 rounded-xl border border-slate-800">
                <div>
                  <p className="text-xs text-slate-400">គ្រូបង្រៀនទទួលបន្ទុក</p>
                  <p className="text-sm font-semibold text-slate-200 mt-0.5">{selectedSubject.teacher}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">រយៈពេលសិក្សា</p>
                  <p className="text-sm font-semibold text-slate-200 mt-0.5">{selectedSubject.hours}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">
                  មេរៀនសំខាន់ៗក្នុងកម្មវិធីសិក្សា
                </p>
                <div className="space-y-2">
                  {selectedSubject.topics?.map((topic, index) => (
                    <div key={index} className="flex items-center gap-2.5 text-sm text-slate-300 bg-slate-900/60 px-3.5 py-2.5 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#0d121c] border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setSelectedSubject(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl transition-colors"
              >
                បិទ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 2. MODAL បន្ថែមមុខវិជ្ជាថ្មី (នៅពេលចុចប៊ូតុង "បន្ថែមមុខវិជ្ជា") ---------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111723] border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-500" />
                <span>បន្ថែមមុខវិជ្ជាថ្មី</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleAddSubject} className="p-6 space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">កូដមុខវិជ្ជា (Subject Code)</label>
                <input
                  type="text"
                  placeholder="ឧ. HIS12"
                  required
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                  className="w-full bg-[#1a2332] text-slate-200 text-sm px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">ឈ្មោះមុខវិជ្ជា (ភាសាខ្មែរ)</label>
                <input
                  type="text"
                  placeholder="ឧ. ប្រវត្តិវិទ្យា"
                  required
                  value={newSubject.titleKh}
                  onChange={(e) => setNewSubject({ ...newSubject, titleKh: e.target.value })}
                  className="w-full bg-[#1a2332] text-slate-200 text-sm px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">ឈ្មោះមុខវិជ្ជា (English)</label>
                <input
                  type="text"
                  placeholder="ឧ. History"
                  value={newSubject.titleEn}
                  onChange={(e) => setNewSubject({ ...newSubject, titleEn: e.target.value })}
                  className="w-full bg-[#1a2332] text-slate-200 text-sm px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">គ្រូបង្រៀនទទួលបន្ទុក</label>
                <input
                  type="text"
                  placeholder="ឧ. លោកគ្រូ ម៉ៅ ពិសិដ្ឋ"
                  value={newSubject.teacher}
                  onChange={(e) => setNewSubject({ ...newSubject, teacher: e.target.value })}
                  className="w-full bg-[#1a2332] text-slate-200 text-sm px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-colors"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-blue-600/20"
                >
                  រក្សាទុក
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}