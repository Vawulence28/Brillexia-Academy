'use client';

import Link from 'next/link';

export default function LandingPage() {
  const whatsappUrl = "https://wa.me/2349022012861?text=Hello%20Brillexia%20Academy,%20I%20would%20like%20to%20book%20a%20FREE%20trial%20class.";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* --- NAVIGATION BAR --- */}
      <header className="bg-[#142B55] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center font-bold text-[#142B55] text-xl shadow-sm">
              💡
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-white">BRILLEXIA</h1>
              <p className="text-[10px] text-[#D4AF37] tracking-widest font-semibold uppercase">Academy</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#about" className="hover:text-[#D4AF37] transition">Why Us</a>
            <a href="#curricula" className="hover:text-[#D4AF37] transition">Curricula</a>
            <a href="#offerings" className="hover:text-[#D4AF37] transition">Subjects & Exams</a>
            <a href="#contact" className="hover:text-[#D4AF37] transition">Contact</a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="bg-[#D4AF37] hover:bg-[#c29f2e] text-[#142B55] font-bold px-5 py-2.5 rounded-lg text-sm transition shadow-sm"
            >
              Portal Login →
            </Link>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="bg-gradient-to-b from-[#142B55] to-[#1c386b] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="bg-[#D4AF37] text-[#142B55] text-xs font-extrabold uppercase px-3.5 py-1.5 rounded-full tracking-wider">
              Ready to Excel?
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Igniting Brilliance, <br />
              <span className="text-[#D4AF37]">Shaping Futures.</span>
            </h1>
            <p className="text-slate-200 text-lg leading-relaxed">
              Learning online doesn't have to be boring. Give your child the best 1-on-1 online learning experience with simplified lessons, interactive classes, and exam-focused guidance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-6 py-3.5 rounded-xl text-center transition flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>💬 Book a FREE Trial Class</span>
              </a>
              <Link
                href="/login"
                className="bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#142B55] font-bold px-6 py-3.5 rounded-xl text-center transition"
              >
                Access LMS Portal
              </Link>
            </div>

            <div className="pt-6 border-t border-[#294c8b] flex flex-wrap gap-6 text-xs text-slate-300">
              <div>📍 <strong>Flexible & Convenient</strong> Online Classes</div>
              <div>⚡ <strong>Proven Results</strong> & Weekly Assessments</div>
            </div>
          </div>

          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm text-white shadow-2xl">
            <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">Unlock Your Potential</h3>
            <p className="text-sm text-slate-200 mb-6">
              We empower students from <strong>Kindergarten to Year 11</strong> through personalized 1-on-1 tuition tailored to their academic goals.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3">
                <span className="text-[#D4AF37]">✔</span>
                <span>Simplified lessons with an exam-focused approach</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-[#D4AF37]">✔</span>
                <span>Experienced & vetted expert tutors</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-[#D4AF37]">✔</span>
                <span>Interactive live 1-on-1 virtual classrooms</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-[#D4AF37]">✔</span>
                <span>Weekly assessments & continuous progress tracking</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- GLOBAL CURRICULA SECTION --- */}
      <section id="curricula" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-[#D4AF37] tracking-widest uppercase mb-2">Global Standards</p>
          <h2 className="text-3xl font-bold text-[#142B55] mb-10">We Teach Multiple Global Curricula</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition">
              <div className="text-4xl mb-3">🇬🇧</div>
              <h3 className="font-bold text-[#142B55]">British Curriculum</h3>
              <p className="text-xs text-slate-500 mt-1">KS1, KS2, KS3, GCSE, 11+ (GL & CEM)</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition">
              <div className="text-4xl mb-3">🇺🇸</div>
              <h3 className="font-bold text-[#142B55]">American Curriculum</h3>
              <p className="text-xs text-slate-500 mt-1">Elementary, Middle & SAT Prep</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition">
              <div className="text-4xl mb-3">🇨🇦</div>
              <h3 className="font-bold text-[#142B55]">Canadian Curriculum</h3>
              <p className="text-xs text-slate-500 mt-1">Ontario & Provincial Standards</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition">
              <div className="text-4xl mb-3">🇳🇬</div>
              <h3 className="font-bold text-[#142B55]">Nigerian Curriculum</h3>
              <p className="text-xs text-slate-500 mt-1">UTME, WAEC, NECO & Common Entrance</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- WHY CHOOSE US SECTION --- */}
      <section id="about" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="bg-[#142B55] text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Why Choose Us?
            </span>
            <h2 className="text-3xl font-bold text-[#142B55] mt-4">Quality Teaching, Excellent Results</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="text-3xl mb-3">🎓</div>
              <h4 className="font-bold text-[#142B55] text-sm mb-1">Expert Tutors</h4>
              <p className="text-xs text-slate-500">Qualified educators committed to academic excellence.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-bold text-[#142B55] text-sm mb-1">Exam-Focused</h4>
              <p className="text-xs text-slate-500">Targeted preparation for top-tier performance.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="text-3xl mb-3">💻</div>
              <h4 className="font-bold text-[#142B55] text-sm mb-1">Interactive Classes</h4>
              <p className="text-xs text-slate-500">Engaging 1-on-1 virtual instruction.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="text-3xl mb-3">📈</div>
              <h4 className="font-bold text-[#142B55] text-sm mb-1">Proven Results</h4>
              <p className="text-xs text-slate-500">Track record of grade improvements.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="text-3xl mb-3">🤝</div>
              <h4 className="font-bold text-[#142B55] text-sm mb-1">Personalised Support</h4>
              <p className="text-xs text-slate-500">Tailored learning plans for every student.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SUBJECTS & EXAM PREP SECTION --- */}
      <section id="offerings" className="py-20 bg-[#142B55] text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-bold text-[#D4AF37] mb-6">Expert Tuition In</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-white/5 rounded-lg">📐 Mathematics</div>
              <div className="p-3 bg-white/5 rounded-lg">📖 English Language</div>
              <div className="p-3 bg-white/5 rounded-lg">🔬 General Sciences</div>
              <div className="p-3 bg-white/5 rounded-lg">🧪 Chemistry & Physics</div>
              <div className="p-3 bg-white/5 rounded-lg">💻 ICT & Coding</div>
              <div className="p-3 bg-white/5 rounded-lg">🗣️ Languages (Yoruba, French)</div>
            </div>
            <p className="text-xs text-slate-300 mt-6 pt-4 border-t border-white/10">
              Covering <strong>Kindergarten to Year 11</strong>
            </p>
          </div>

          <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-bold text-[#D4AF37] mb-6">Comprehensive Exam Preparation</h3>
            <div className="flex flex-wrap gap-3">
              {['SAT', 'GCSE', 'UTME', 'WAEC', 'NECO', '11+ (GL & CEM)', 'Common Entrance'].map((exam) => (
                <span key={exam} className="bg-[#D4AF37] text-[#142B55] font-bold px-4 py-2 rounded-xl text-xs">
                  {exam}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-300 mt-8 leading-relaxed">
              Our structured exam preparation programs focus on past questions, time management, mock assessments, and strategic feedback to build confidence and ensure top scores.
            </p>
          </div>
        </div>
      </section>

      {/* --- FOOTER / CALL TO ACTION --- */}
      <footer id="contact" className="bg-slate-900 text-white py-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-[#D4AF37] text-lg mb-2">BRILLEXIA ACADEMY</h4>
            <p className="text-xs text-slate-400">Igniting Brilliance, Shaping Futures.</p>
            <div className="mt-4 flex space-x-3 text-sm text-slate-300">
              <span>📱 Instagram / Tiktok / Facebook / YouTube:</span>
              <strong className="text-white">@brillexia_academy</strong>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm mb-3">Direct Contact & WhatsApp</h5>
            <p className="text-xs text-slate-300">📞 Phone: +234 816 552 5333</p>
            <p className="text-xs text-slate-300 mt-1">💬 WhatsApp: +234 902 201 2861</p>
            <p className="text-xs text-slate-300 mt-1">🌐 Web: ebrillexiaacademy</p>
          </div>

          <div className="flex flex-col justify-center items-start md:items-end">
            <Link
              href="/login"
              className="bg-[#D4AF37] hover:bg-[#c29f2e] text-[#142B55] font-bold px-6 py-3 rounded-xl text-sm transition shadow-md"
            >
              Go to LMS Portal →
            </Link>
            <p className="text-[11px] text-slate-500 mt-3">
              &copy; {new Date().getFullYear()} Brillexia Academy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}