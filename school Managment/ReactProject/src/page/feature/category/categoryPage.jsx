import React, { useState, useMemo } from 'react';
//nimport React, { useState, useEffect } from "react";
import "./category.css";

import { 
  Search, 
  Plus, 
  FileSpreadsheet, 
  UploadCloud, 
  Edit3, 
  Eye, 
  Trash2, 
  UserPlus, 
  MessageSquare, 
  Calendar, 
  GraduationCap, 
  Filter, 
  X, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Users,
  BookOpen,
  Award
} from 'lucide-react';

const INITIAL_STUDENTS = [
  { id: 'STD-1061', name: 'ឡេង ប៊ុនធឿន', nameLatin: 'leng bunthoeun', gender: 'ប្រុស', level: 'វិទ្យាល័យ', gradeClass: 'ថ្នាក់ទី ១២-ក (វិទ្យាសាស្ត្រ-ពិត)', status: 'កំពុងរៀន', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120' },
  { id: 'STD-1060', name: 'អ៊ុច កល្យាណ', nameLatin: 'STUDENT 60', gender: 'ស្រី', level: 'វិទ្យាល័យ', gradeClass: 'ថ្នាក់ទី ១២-ខ (សង្គម-ជ្រើសរើស)', status: 'កំពុងរៀន', avatar: '' },
  { id: 'STD-1059', name: 'ហេង មករា', nameLatin: 'STUDENT 59', gender: 'ប្រុស', level: 'វិទ្យាល័យ', gradeClass: 'ថ្នាក់ទី ១២-ខ (សង្គម-ជ្រើសរើស)', status: 'កំពុងរៀន', avatar: '' },
  { id: 'STD-1058', name: 'សុខ ចរិយា', nameLatin: 'STUDENT 58', gender: 'ស្រី', level: 'វិទ្យាល័យ', gradeClass: 'ថ្នាក់ទី ១២-ខ (សង្គម-ជ្រើសរើស)', status: 'កំពុងរៀន', avatar: '' },
  { id: 'STD-1057', name: 'យ៉េម កុសល', nameLatin: 'STUDENT 57', gender: 'ប្រុស', level: 'វិទ្យាល័យ', gradeClass: 'ថ្នាក់ទី ១២-ខ (សង្គម-ជ្រើសរើស)', status: 'កំពុងរៀន', avatar: '' },
  { id: 'STD-1056', name: 'គង់ សុវណ្ណ', nameLatin: 'STUDENT 56', gender: 'ប្រុស', level: 'វិទ្យាល័យ', gradeClass: 'ថ្នាក់ទី ១២-ក (វិទ្យាសាស្ត្រ-ពិត)', status: 'កំពុងរៀន', avatar: '' },
  { id: 'STD-1055', name: 'យ៉ែម វិបុល', nameLatin: 'STUDENT 55', gender: 'ប្រុស', level: 'វិទ្យាល័យ', gradeClass: 'ថ្នាក់ទី ១២-ក (វិទ្យាសាស្ត្រ-ពិត)', status: 'កំពុងរៀន', avatar: '' },
  { id: 'STD-1054', name: 'ចាន់ សុវណ្ណារ៉ា', nameLatin: 'STUDENT 54', gender: 'ប្រុស', level: 'វិទ្យាល័យ', gradeClass: 'ថ្នាក់ទី ១២-ក (វិទ្យាសាស្ត្រ-ពិត)', status: 'កំពុងរៀន', avatar: '' },
  { id: 'STD-1053', name: 'ឈិន គឹមហុង', nameLatin: 'STUDENT 53', gender: 'ស្រី', level: 'អនុវិទ្យាល័យ', gradeClass: 'ថ្នាក់ទី ៩-ក', status: 'កំពុងរៀន', avatar: '' },
  { id: 'STD-1052', name: 'កែវ មនោរម្យ', nameLatin: 'STUDENT 52', gender: 'ស្រី', level: 'បឋមសិក្សា', gradeClass: 'ថ្នាក់ទី ៥-ខ', status: 'កំពុងរៀន', avatar: '' },
  { id: 'STD-1051', name: 'ជា សុភក្រ', nameLatin: 'STUDENT 51', gender: 'ប្រុស', level: 'មត្តេយ្យ', gradeClass: 'ថ្នាក់កម្រិតខ្ពស់', status: 'កំពុងរៀន', avatar: '' },
];

const LEVEL_OPTIONS = ['ទាំងអស់', 'មត្តេយ្យ', 'បឋមសិក្សា', 'អនុវិទ្យាល័យ', 'វិទ្យាល័យ'];

export default function App() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ទាំងអស់');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal display states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form input state
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    nameLatin: '',
    gender: 'ប្រុស',
    level: 'វិទ្យាល័យ',
    gradeClass: 'ថ្នាក់ទី ១២-ក (វិទ្យាសាស្ត្រ-ពិត)',
    status: 'កំពុងរៀន'
  });

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.nameLatin.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLevel = selectedLevel === 'ទាំងអស់' || student.level === selectedLevel;

      return matchesSearch && matchesLevel;
    });
  }, [students, searchQuery, selectedLevel]);

  // Paginated students slice
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;

  const handleOpenAddModal = () => {
    const nextIdNum = Math.max(...students.map(s => parseInt(s.id.replace('STD-', '')) || 0), 1000) + 1;
    setFormData({
      id: `STD-${nextIdNum}`,
      name: '',
      nameLatin: '',
      gender: 'ប្រុស',
      level: 'វិទ្យាល័យ',
      gradeClass: 'ថ្នាក់ទី ១២-ក (វិទ្យាសាស្ត្រ-ពិត)',
      status: 'កំពុងរៀន'
    });
    setIsAddModalOpen(true);
  };

  const handleSaveNewStudent = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    const newStudent = {
      ...formData,
      nameLatin: formData.nameLatin || `STUDENT ${formData.id.split('-')[1]}`,
      avatar: ''
    };
    
    setStudents([newStudent, ...students]);
    setIsAddModalOpen(false);
    showToast('បានចុះឈ្មោះសិស្សថ្មីដោយជោគជ័យ!');
  };

  const handleOpenEditModal = (student) => {
    setSelectedStudent(student);
    setFormData({ ...student });
    setIsEditModalOpen(true);
  };

  const handleUpdateStudent = (e) => {
    e.preventDefault();
    setStudents(students.map(s => s.id === formData.id ? formData : s));
    setIsEditModalOpen(false);
    showToast('បានកែប្រែព័ត៌មានសិស្សរួចរាល់!');
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm('តើអ្នកពិតជាចង់លុបទិន្នន័យសិស្សនេះមែនទេ?')) {
      setStudents(students.filter(s => s.id !== id));
      showToast('បានលុបទិន្នន័យសិស្សរួចរាល់!');
    }
  };

  const handleOpenViewModal = (student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const handleExportCSV = () => {
    const headers = ['អត្តលេខ', 'ឈ្មោះ', 'ឈ្មោះជាអក្សរឡាតាំង', 'ភេទ', 'កម្រិតសិក្សា', 'ថ្នាក់រៀន', 'ស្ថានភាព'];
    const rows = filteredStudents.map(s => [s.id, s.name, s.nameLatin, s.gender, s.level, s.gradeClass, s.status]);
    
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `student_directory_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('ទាញយកទិន្នន័យ Excel រួចរាល់!');
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 transition-all duration-300">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <GraduationCap className="w-7 h-7 text-indigo-600" />
              បញ្ជីសិស្សានុសិស្ស <span className="text-xs sm:text-sm font-semibold text-slate-500">(Student Directory)</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              ព័ត៌មានលម្អិតសិស្សចុះឈ្មោះចូលរៀនទាំងអស់ - ឆ្នាំសិក្សា ២០២៤-២០២៥
            </p>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto flex-wrap sm:flex-nowrap">
            <div className="hidden sm:flex items-center text-xs text-slate-600 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200 gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span className="font-medium">អាទិត្យ ទី០៦ ខែ០៩ ឆ្នាំ២០២៦</span>
            </div>

            <button className="relative p-2.5 text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition">
              <MessageSquare className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">3</span>
            </button>

            <button 
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2.5 rounded-lg shadow-sm font-medium transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ ចុះឈ្មោះសិស្សថ្មី</span>
            </button>
          </div>
        </div>
      </header>

      {}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">សិស្សសរុប</p>
              <h3 className="text-xl font-bold text-slate-900">{students.length} នាក់</h3>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">កំពុងសិក្សា</p>
              <h3 className="text-xl font-bold text-slate-900">{students.filter(s => s.status === 'កំពុងរៀន').length} នាក់</h3>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">កម្រិតវិទ្យាល័យ</p>
              <h3 className="text-xl font-bold text-slate-900">{students.filter(s => s.level === 'វិទ្យាល័យ').length} នាក់</h3>
            </div>
          </div>
        </div>

        {/* Filter & Control Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            
            {/* Title */}
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-base sm:text-lg">
                  បញ្ជីសិស្សទើបចុះឈ្មោះថ្មី <span className="text-slate-500 text-xs sm:text-sm font-normal">(Recent Admissions)</span>
                </h2>
                <p className="text-xs text-slate-500">ព័ត៌មានលម្អិតសិស្សបានចុះឈ្មោះចូលរៀន</p>
              </div>
            </div>

            {/* Excel Export & Import Actions */}
            <div className="flex items-center gap-2">
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg transition shadow-sm font-medium"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>នាំចេញ Excel</span>
              </button>
              <button 
                onClick={() => showToast('មុខងារនាំចូលទិន្នន័យត្រៀមរួចរាល់')}
                className="flex items-center gap-1.5 text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg transition shadow-sm font-medium"
              >
                <UploadCloud className="w-4 h-4" />
                <span>នាំចូល Excel</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Buttons */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="ស្វែងរកឈ្មោះ ឬអត្តលេខ..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <Filter className="w-4 h-4 text-slate-400 mr-1 flex-shrink-0" />
              {LEVEL_OPTIONS.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setSelectedLevel(lvl);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition flex-shrink-0 ${
                    selectedLevel === lvl
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-4">អត្តលេខ</th>
                  <th className="py-3.5 px-4">គោត្តនាម-នាម</th>
                  <th className="py-3.5 px-4 text-center">ភេទ</th>
                  <th className="py-3.5 px-4">កម្រិតសិក្សា</th>
                  <th className="py-3.5 px-4">ថ្នាក់រៀន</th>
                  <th className="py-3.5 px-4">ស្ថានភាព</th>
                  <th className="py-3.5 px-4 text-center">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-indigo-50/30 transition">
                      
                      {/* ID */}
                      <td className="py-3.5 px-4 font-semibold text-indigo-600 whitespace-nowrap">
                        {student.id}
                      </td>

                      {/* Name with Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200">
                            {student.avatar ? (
                              <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-slate-500 font-bold text-xs">
                                {student.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{student.name}</div>
                            <div className="text-xs text-slate-400">{student.nameLatin}</div>
                          </div>
                        </div>
                      </td>

                      {/* Gender */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.gender === 'ប្រុស' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-pink-50 text-pink-600 border border-pink-100'
                        }`}>
                          {student.gender}
                        </span>
                      </td>

                      {/* Level */}
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200">
                          {student.level}
                        </span>
                      </td>

                      {/* Grade Class */}
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {student.gradeClass}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>{student.status}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenViewModal(student)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition"
                            title="មើលព័ត៌មាន"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(student)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition"
                            title="កែប្រែ"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                            title="លុប"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      មិនមានទិន្នន័យសិស្សត្រូវបង្ហាញឡើយ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              បង្ហាញ {filteredStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} ដល់ {Math.min(currentPage * itemsPerPage, filteredStudents.length)} នៃទិន្នន័យសរុប {filteredStudents.length}
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-slate-200 rounded hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="px-3 py-1 bg-white border border-slate-200 rounded font-medium text-slate-700">
                {currentPage} / {totalPages}
              </span>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 border border-slate-200 rounded hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                ចុះឈ្មោះសិស្សថ្មី
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewStudent} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">អត្តលេខសិស្ស</label>
                  <input
                    type="text"
                    disabled
                    value={formData.id}
                    className="w-full px-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">ភេទ</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="ប្រុស">ប្រុស</option>
                    <option value="ស្រី">ស្រី</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">គោត្តនាម និងនាម <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="ឧ. ឡេង ប៊ុនធឿន"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">ឈ្មោះជាអក្សរឡាតាំង (Optional)</label>
                <input
                  type="text"
                  placeholder="ឧ. LENG BUNTHOEUN"
                  value={formData.nameLatin}
                  onChange={(e) => setFormData({...formData, nameLatin: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">កម្រិតសិក្សា</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="មត្តេយ្យ">មត្តេយ្យ</option>
                    <option value="បឋមសិក្សា">បឋមសិក្សា</option>
                    <option value="អនុវិទ្យាល័យ">អនុវិទ្យាល័យ</option>
                    <option value="វិទ្យាល័យ">វិទ្យាល័យ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">ថ្នាក់រៀន</label>
                  <input
                    type="text"
                    value={formData.gradeClass}
                    onChange={(e) => setFormData({...formData, gradeClass: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm"
                >
                  រក្សាទុក
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-600" />
                កែប្រែព័ត៌មានសិស្ស ({formData.id})
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStudent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">គោត្តនាម និងនាម</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">ឈ្មោះជាអក្សរឡាតាំង</label>
                <input
                  type="text"
                  value={formData.nameLatin}
                  onChange={(e) => setFormData({...formData, nameLatin: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">ភេទ</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="ប្រុស">ប្រុស</option>
                    <option value="ស្រី">ស្រី</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">កម្រិតសិក្សា</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="មត្តេយ្យ">មត្តេយ្យ</option>
                    <option value="បឋមសិក្សា">បឋមសិក្សា</option>
                    <option value="អនុវិទ្យាល័យ">អនុវិទ្យាល័យ</option>
                    <option value="វិទ្យាល័យ">វិទ្យាល័យ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">ថ្នាក់រៀន</label>
                <input
                  type="text"
                  value={formData.gradeClass}
                  onChange={(e) => setFormData({...formData, gradeClass: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium shadow-sm"
                >
                  កែប្រែ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {isViewModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-indigo-600 text-white relative">
              <button 
                onClick={() => setIsViewModalOpen(false)} 
                className="absolute top-4 right-4 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white flex items-center justify-center overflow-hidden font-bold text-xl">
                  {selectedStudent.avatar ? (
                    <img src={selectedStudent.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    selectedStudent.name.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedStudent.name}</h3>
                  <p className="text-xs text-indigo-100">{selectedStudent.nameLatin}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 text-xs rounded font-medium">
                    {selectedStudent.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">ភេទ:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.gender}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">កម្រិតសិក្សា:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.level}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">ថ្នាក់រៀន:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.gradeClass}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">ស្ថានភាព:</span>
                <span className="font-semibold text-emerald-600">{selectedStudent.status}</span>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 text-sm bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium"
              >
                បិទ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}