import re

def fix_file(file_path, icon_name, theme_color, theme_color_text, title, subtitle):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'lucide-react' not in content:
        content = content.replace("import React", f"import {{ BookOpen, Sparkles, Printer, Loader2, Save, Trash2, List, FileText, ClipboardList, Target, BarChart, MessageCircle, Calculator, Layout, AlertCircle, Download, Upload }} from 'lucide-react';\nimport React")
    else:
        # ensure some icons are there
        if 'BookOpen' not in content:
            content = content.replace("import {", "import { BookOpen, Sparkles, Printer, FileText, ClipboardList, ")

    # Find the grid line
    grid_match = re.search(r'<div className="grid lg:grid-cols-[^>]+>', content)
    if not grid_match:
        print(f"Grid not found in {file_path}")
        return
        
    grid_tag = grid_match.group(0)

    # Replace the outer wrapper
    pattern_wrapper = re.compile(r'<div className="gen-card rounded-2xl p-6 md:p-8\s*shadow-xl">.*?<div className="grid lg:grid-cols-[^>]+>', re.DOTALL)
    
    new_header = f"""<div className="flex flex-col h-full bg-gray-50 text-gray-900">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-{theme_color}-100 rounded-xl flex items-center justify-center text-{theme_color_text} border border-{theme_color}-200 shadow-sm">
            <{icon_name} size={{24}} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-wide">{title}</h1>
            <p className="text-sm text-{theme_color_text}">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          {grid_tag}"""
    
    content = pattern_wrapper.sub(new_header, content)

    # Card wrappers
    content = content.replace('gen-card bg-red-50 rounded-xl p-5 mb-4 shadow-sm border border-blue-500/20', 'bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-4')
    content = content.replace('gen-card bg-red-50 rounded-xl p-5 mb-4 shadow-sm', 'bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-4')
    content = content.replace('gen-card bg-red-50 rounded-xl p-5 shadow-sm', 'bg-white p-6 rounded-2xl border border-gray-200 shadow-sm')
    content = content.replace('gen-card bg-red-50 rounded-xl p-6 sticky top-24 shadow-xl', 'bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-6')
    
    # Right panel wrapper (result)
    content = content.replace('gen-card bg-red-50 rounded-xl p-4 min-h-[600px] overflow-auto', 'bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col min-h-[800px]')

    # Small cards
    content = content.replace('gen-card flex items-start gap-3 p-3 bg-red-50 rounded-lg', 'flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100')
    content = content.replace('gen-card space-y-3 text-sm bg-white p-4 rounded-lg', 'space-y-3 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100')
    content = content.replace('gen-card mt-6 p-4 bg-red-50 rounded-lg text-xs', 'mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs')

    # Inputs
    content = content.replace('bg-red-50 border border-black', 'bg-gray-50 border border-gray-300')
    content = content.replace('focus:border-amber-500', 'focus:border-blue-500 focus:ring-2 focus:ring-blue-200')
    content = content.replace('focus:border-blue-500', 'focus:border-blue-500 focus:ring-2 focus:ring-blue-200')

    # Text colors
    content = content.replace('text-black', 'text-gray-900')
    content = content.replace('text-gray-600', 'text-gray-500')
    
    # Adding closing divs (We added 2 extra divs: flex-1 and max-w-7xl)
    content = content.replace('<PrintSupportModal', '</div></div><PrintSupportModal')

    # Buttons
    content = content.replace('📔 Generate Jurnal', '<Sparkles size={20} /> Generate Jurnal')
    content = content.replace('🖨️ Print', '<Printer size={20} /> Cetak')
    content = content.replace('📋 Generate Instrumen', '<Sparkles size={20} /> Generate Instrumen')
    content = content.replace('👨‍🏫', '<FileText size={18} className="text-blue-500 inline-block mr-1"/>')
    content = content.replace('📝', '')
    content = content.replace('🎯', '')
    content = content.replace('📌', '')
    content = content.replace('🔍', '')
    content = content.replace('📔', '')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('src/components/DailyJournal.tsx', 'BookOpen', 'amber', 'amber-600', 'Jurnal Harian Pembelajaran', 'Terintegrasi dengan Modul Ajar & Sesuai Kurikulum Merdeka')
fix_file('src/components/Supervision.tsx', 'ClipboardList', 'indigo', 'indigo-600', 'Instrumen Supervisi Akademik', 'Berdasarkan Perdirjen GTK No. 7327/B.B1/HK.03.01/2023')

print("Styles fixed.")
