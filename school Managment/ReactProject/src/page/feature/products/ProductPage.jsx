import React, { useState } from 'react';
import { Search, Calendar, Save, Sparkles, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

export default function DailyAttendance() {
  const [selectedDate, setSelectedDate] = useState('2026-09-06');
  const [selectedSubject, setSelectedSubject] = useState('Advanced AI & Data Science (វិទ្យាសាស្ត្រទិន្នន័យ)');
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // បញ្ជីសិស្ស និងស្ថានភាពវត្តមាន
  const [students, setStudents] = useState([
    { id: 'STD-1001', name: 'Alex Morgan', level: 'វិទ្យាល័យ', grade: 'Grade 10-A', status: 'present', remark: '' },
    { id: 'STD-1002', name: 'Sophia Chen', level: 'វិទ្យាល័យ', grade: 'Grade 10-A', status: 'present', remark: '' },
    { id: 'STD-1003', name: 'Liam Johnson', level: 'វិទ្យាល័យ', grade: 'Grade 11-B', status: 'present', remark: '' },
    { id: 'STD-1004', name: 'Emma Watson', level: 'វិទ្យាល័យ', grade: 'Grade 11-B', status: 'permitted', remark: '' },
    { id: 'STD-1005', name: 'Noah Davis', level: 'វិទ្យាល័យ', grade: 'Grade 12-A', status: 'late', remark: '' },
    { id: 'STD-1006', name: 'Olivia Wilson', level: 'អនុវិទ្យាល័យ', grade: 'Grade 9-A', status: 'absent', remark: '' },
  ]);

  // ការផ្លាស់ប្តូរស្ថានភាពវត្តមាន
  const handleStatusChange = (id, newStatus) => {
    setStudents(prev =>
      prev.map(student => student.id === id ? { ...student, status: newStatus } : student)
    );
  };

  // ការផ្លាស់ប្តូរចំណាំ
  const handleRemarkChange = (id, text) => {
    setStudents(prev =>
      prev.map(student => student.id === id ? { ...student, remark: text } : student)
    );
  };

  // តម្រងសិស្សតាមការស្វែងរក និងកម្រិត
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || student.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="flex-1 bg-[#0b0f17] text-slate-200 p-8 font-['Kantumruy_Pro',sans-serif] min-h-screen">
      
      {/* Header ផ្នែកខាងលើ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/60">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            ការកត់ត្រាវត្តមានប្រចាំថ្ងៃ (Daily Attendance)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            ការតាមដានវត្តមានសិស្សប្រចាំថ្ងៃតាមថ្នាក់ និងមុខវិជ្ជា
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-2 rounded-xl border border-slate-700 transition-all">
            <span>អ្នកទិន្នន័យឡើងវិញ</span>
          </button>
          <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-purple-600/20 font-medium transition-all">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Copilot</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs តាមកម្រិតសិក្សា */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <span className="text-xs text-slate-400 mr-2">កម្រិតសិក្សា៖</span>
        <button
          onClick={() => setFilterLevel('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
            filterLevel === 'all'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-[#131924] text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          ទាំងអស់
        </button>
        <button
          onClick={() => setFilterLevel('បឋមសិក្សា')}
          className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
            filterLevel === 'បឋមសិក្សា'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-[#131924] text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          បឋមសិក្សា
        </button>
        <button
          onClick={() => setFilterLevel('អនុវិទ្យាល័យ')}
          className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
            filterLevel === 'អនុវិទ្យាល័យ'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-[#131924] text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          អនុវិទ្យាល័យ
        </button>
        <button
          onClick={() => setFilterLevel('វិទ្យាល័យ')}
          className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
            filterLevel === 'វិទ្យាល័យ'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-[#131924] text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          វិទ្យាល័យ
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-[#111723] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
        
        {/* Top Controls inside Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-400">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">ការកត់ត្រាវត្តមានប្រចាំថ្ងៃ</h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Date Input */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[#1a2332] text-slate-200 text-xs px-3.5 py-2 rounded-xl border border-slate-700/80 focus:outline-none focus:border-blue-500"
            />

            {/* Subject Selector */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-[#1a2332] text-slate-200 text-xs px-3.5 py-2 rounded-xl border border-slate-700/80 focus:outline-none focus:border-blue-500"
            >
              <option>Advanced AI & Data Science (វិទ្យាសាស្ត្រទិន្នន័យ)</option>
              <option>Mathematics Grade 12 (គណិតវិទ្យា)</option>
              <option>Physics Grade 12 (រូបវិទ្យា)</option>
            </select>

            {/* Save Button */}
            <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg shadow-blue-600/20 transition-all">
              <Save className="w-4 h-4" />
              <span>រក្សារក្សាទុកវត្តមាន</span>
            </button>
          </div>
        </div>

        {/* Table - បញ្ជីសិស្សកត់វត្តមាន */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs">
                <th className="pb-3 font-semibold px-3">អត្តលេខ</th>
                <th className="pb-3 font-semibold px-3">ឈ្មោះសិស្ស</th>
                <th className="pb-3 font-semibold px-3">កម្រិត</th>
                <th className="pb-3 font-semibold px-3">ថ្នាក់</th>
                <th className="pb-3 font-semibold px-3 text-center">ស្ថានភាពវត្តមាន</th>
                <th className="pb-3 font-semibold px-3 text-right">ចំណាំផ្សេងៗ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-800/30 transition-colors">
                  {/* ID */}
                  <td className="py-4 px-3 font-semibold text-slate-300">{student.id}</td>

                  {/* Student Name */}
                  <td className="py-4 px-3 font-bold text-blue-400 hover:underline cursor-pointer">
                    {student.name}
                  </td>

                  {/* Level Badge */}
                  <td className="py-4 px-3">
                    <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md border border-slate-700/60 font-medium text-[11px]">
                      {student.level}
                    </span>
                  </td>

                  {/* Grade */}
                  <td className="py-4 px-3 text-slate-300 font-medium">{student.grade}</td>

                  {/* Radio Buttons ជ្រើសរើសវត្តមាន (Present, Permitted, Late, Absent) */}
                  <td className="py-4 px-3">
                    <div className="flex items-center justify-center gap-4">
                      {/* វត្តមាន (Present) */}
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`attendance-${student.id}`}
                          checked={student.status === 'present'}
                          onChange={() => handleStatusChange(student.id, 'present')}
                          className="w-3.5 h-3.5 text-blue-600 focus:ring-0 bg-slate-800 border-slate-700"
                        />
                        <span className={`text-[11px] ${student.status === 'present' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                          វត្តមាន (Present)
                        </span>
                      </label>

                      {/* ច្បាប់ (Permitted) */}
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`attendance-${student.id}`}
                          checked={student.status === 'permitted'}
                          onChange={() => handleStatusChange(student.id, 'permitted')}
                          className="w-3.5 h-3.5 text-blue-600 focus:ring-0 bg-slate-800 border-slate-700"
                        />
                        <span className={`text-[11px] ${student.status === 'permitted' ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}>
                          ច្បាប់ (Permitted)
                        </span>
                      </label>

                      {/* យឺត (Late) */}
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`attendance-${student.id}`}
                          checked={student.status === 'late'}
                          onChange={() => handleStatusChange(student.id, 'late')}
                          className="w-3.5 h-3.5 text-blue-600 focus:ring-0 bg-slate-800 border-slate-700"
                        />
                        <span className={`text-[11px] ${student.status === 'late' ? 'text-orange-400 font-semibold' : 'text-slate-400'}`}>
                          យឺត (Late)
                        </span>
                      </label>

                      {/* អវត្តមាន (Absent) */}
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`attendance-${student.id}`}
                          checked={student.status === 'absent'}
                          onChange={() => handleStatusChange(student.id, 'absent')}
                          className="w-3.5 h-3.5 text-blue-600 focus:ring-0 bg-slate-800 border-slate-700"
                        />
                        <span className={`text-[11px] ${student.status === 'absent' ? 'text-red-400 font-semibold' : 'text-slate-400'}`}>
                          អវត្តមាន (Absent)
                        </span>
                      </label>
                    </div>
                  </td>

                  {/* Remark Input */}
                  <td className="py-4 px-3 text-right">
                    <input
                      type="text"
                      placeholder="បញ្ចូលចំណាំ..."
                      value={student.remark}
                      onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                      className="bg-[#1a2332] text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500 w-36 text-right placeholder:text-slate-600"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Footer Title - កំណត់ត្រាវត្តមានកន្លងមក */}
      <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-slate-400 text-sm font-semibold">
        <Clock className="w-4 h-4 text-blue-400" />
        <span>កំណត់ត្រាវត្តមានកន្លងមក</span>
      </div>

    </div>
  );
}