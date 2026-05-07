import { Link } from 'react-router-dom';
import { FiBookOpen, FiUsers, FiLock, FiSearch, FiBarChart2, FiRepeat, FiShield, FiFileText, FiClock, FiCheckCircle, FiTrendingUp, FiMenu, FiPhone, FiMail, FiGlobe } from 'react-icons/fi';
import SiteNavbar from '../components/SiteNavbar';
import SectionTitle from '../components/SectionTitle';

const features = [
  { icon: FiBookOpen, title: 'Book Management', text: 'Add, edit, search, filter, and organize book records with availability tracking.' },
  { icon: FiUsers, title: 'User Management', text: 'Manage students, librarians, and admins with role-based access controls.' },
  { icon: FiRepeat, title: 'Borrowing & Return', text: 'Track issued books, due dates, returns, overdue status, and fines automatically.' },
  { icon: FiBarChart2, title: 'Dashboard Analytics', text: 'View statistics, trends, and activities with clean visual summaries.' },
  { icon: FiFileText, title: 'Reports', text: 'Generate book, borrowing, return, overdue, and user reports with print-ready layouts.' },
  { icon: FiShield, title: 'Secure Login', text: 'Protected authentication with JWT, password hashing, and role-based routing.' }
];

const roles = [
  { title: 'Admin', text: 'Manages users, books, librarians, reports, and system settings.' },
  { title: 'Librarian', text: 'Handles issuing, returns, categories, and daily library operations.' },
  { title: 'Student/User', text: 'Searches books, views borrowing history, and checks due dates.' }
];

const steps = [
  'Register or login to access your dashboard.',
  'Admin or librarian adds books and categories.',
  'Student searches available books quickly.',
  'Librarian issues the selected book.',
  'Student returns the book and overdue status is calculated.',
  'The system generates reports and usage insights.'
];

const stats = [
  { value: '500+', label: 'Books Managed' },
  { value: '100+', label: 'Registered Users' },
  { value: '24/7', label: 'Digital Access' },
  { value: 'Real-Time', label: 'Reports' }
];

const problemPoints = [
  'Difficulty searching for books quickly',
  'Loss or damage of paper records',
  'Delay in tracking borrowed books',
  'Poor monitoring of overdue books',
  'Stressful report generation',
  'Difficulty knowing available and unavailable books'
];

const solutions = [
  'Digital book records with rich search and filtering',
  'Automated borrowing and return tracking',
  'Overdue monitoring and fine calculation',
  'Role-based access for secure operations',
  'Live dashboards and report generation'
];

export default function LandingPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <SiteNavbar />

      <main id="home">
        <section className="bg-hero text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
                <FiLock /> Secure. Fast. Modern.
              </span>
              <h1 className="mt-6 max-w-2xl text-4xl font-black tracking-tight md:text-6xl">
                Manage Library Books, Borrowing, Returns and Reports Digitally
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/80 md:text-lg">
                This web-based Library Management System replaces manual paper records with a secure computerized solution for managing books, users, borrowing, returns, overdue monitoring, and reports.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link to="/register" className="btn-primary bg-white text-brand-900 hover:bg-slate-100">
                  Get Started
                </Link>
                <Link to="/login" className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/15">
                  Login
                </Link>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-sm text-white/70">Designed for</p>
                  <p className="mt-1 text-lg font-bold">SIWES / ITF Project Defense</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-sm text-white/70">Built with</p>
                  <p className="mt-1 text-lg font-bold">React, Node, MongoDB</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-brand-400/30 blur-3xl" />
              <div className="absolute bottom-8 right-0 h-32 w-32 rounded-full bg-orange-400/30 blur-3xl" />
              <div className="glass-card border-white/10 bg-white/10 p-6 text-white shadow-2xl">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[{ label: 'Total Books', value: '500+', icon: FiBookOpen }, { label: 'Active Users', value: '100+', icon: FiUsers }, { label: 'Borrowed Books', value: '68', icon: FiRepeat }, { label: 'Overdue Books', value: '12', icon: FiClock }].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                        <div className="flex items-center justify-between text-white/80">
                          <span className="text-xs font-semibold uppercase tracking-[0.2em]">{item.label}</span>
                          <Icon />
                        </div>
                        <p className="mt-5 text-3xl font-black">{item.value}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 rounded-3xl bg-white/10 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3 text-sm font-semibold text-white/80">
                    <FiTrendingUp /> Live overview
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="h-3 rounded-full bg-white/10">
                      <div className="h-3 w-[72%] rounded-full bg-brand-300" />
                    </div>
                    <div className="h-3 rounded-full bg-white/10">
                      <div className="h-3 w-[54%] rounded-full bg-orange-300" />
                    </div>
                    <div className="h-3 rounded-full bg-white/10">
                      <div className="h-3 w-[88%] rounded-full bg-emerald-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Overview" title="A smarter way to run a library" description="The system helps librarians manage books, students, borrowing records, return records, overdue books, and reports in one secure digital platform." />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="card lg:col-span-2">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-2xl text-brand-700">
                  <FiBookOpen />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">System Purpose</h3>
                  <p className="mt-3 leading-8 text-slate-600">
                    This application digitizes library operations so administrators and librarians can manage books and users, record borrowing and return activities, monitor overdue books, and generate reports without paper-based delays.
                  </p>
                </div>
              </div>
            </div>
            <div className="card">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-600">Key Result</p>
              <p className="mt-3 text-3xl font-black text-slate-900">More accuracy, less stress</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">It improves speed, reduces manual errors, and makes tracking easier for staff and students.</p>
            </div>
          </div>
        </section>

        <section className="bg-white py-20" id="problem-statement">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle eyebrow="Problem Statement" title="What manual library systems struggle with" description="Traditional paper records create delays, inconsistency, and lost information when libraries grow." />
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {problemPoints.map((point) => (
                <div key={point} className="card flex items-start gap-4">
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                    <FiMenu />
                  </div>
                  <p className="font-medium text-slate-700">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Solution" title="How the system solves the problem" description="The platform introduces automation, secure access, and real-time tracking to replace manual workflows." />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {solutions.map((solution, index) => (
              <div key={solution} className="card flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                  <FiCheckCircle />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">0{index + 1}</p>
                  <p className="mt-1 text-lg font-semibold text-slate-800">{solution}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-950 py-20 text-white" id="features">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle eyebrow="Features" title="Everything built into one dashboard" description="Modern cards, secure access, analytics, and workflow tools designed for a proper final-year project presentation." />
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-2xl text-white">
                      <Icon />
                    </div>
                    <h3 className="mt-5 text-xl font-bold">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/70">{feature.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Roles" title="Three user roles with clear responsibilities" description="Each role has a different dashboard and permission set to keep operations organized and secure." />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {roles.map((role) => (
              <div key={role.title} className="card">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                  <FiShield />
                </div>
                <h3 className="mt-4 text-2xl font-bold">{role.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{role.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white py-20" id="how-it-works">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle eyebrow="How It Works" title="A simple step-by-step workflow" description="From login to reporting, the process is easy to understand and demonstrate during defense." />
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step} className="card">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-600">Step {index + 1}</p>
                  <p className="mt-3 text-lg font-semibold text-slate-800">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" id="benefits">
          <SectionTitle eyebrow="Benefits" title="Why the digital system is better" description="The platform improves operations for staff while giving students a better experience." />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {['Saves time', 'Reduces manual paperwork', 'Improves record accuracy', 'Makes book searching faster', 'Helps monitor overdue books', 'Supports better decision making', 'Improves library service delivery'].map((item) => (
              <div key={item} className="card flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                  <FiCheckCircle />
                </div>
                <span className="font-semibold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-950 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle eyebrow="Statistics Preview" title="Project-ready numbers at a glance" description="These statistics support the presentation feel of the system before live data is loaded." />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="text-3xl font-black">{item.value}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/70">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" id="contact">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <SectionTitle eyebrow="Contact" title="Project and developer details" description="Replace the placeholder values below with your actual defense/project information." />
            </div>
            <div className="card grid gap-4 md:grid-cols-2">
              <div><p className="text-sm font-semibold text-slate-500">Developer</p><p className="mt-1 font-bold text-slate-900">Your Name Here</p></div>
              <div><p className="text-sm font-semibold text-slate-500">Department</p><p className="mt-1 font-bold text-slate-900">Computer Science</p></div>
              <div><p className="text-sm font-semibold text-slate-500">Institution</p><p className="mt-1 font-bold text-slate-900">Your Institution</p></div>
              <div><p className="text-sm font-semibold text-slate-500">Email</p><p className="mt-1 font-bold text-slate-900">developer@example.com</p></div>
              <div><p className="text-sm font-semibold text-slate-500">Phone</p><p className="mt-1 font-bold text-slate-900">+234 800 000 0000</p></div>
              <div><p className="text-sm font-semibold text-slate-500">Social</p><div className="mt-1 flex gap-3 text-slate-600"><FiGlobe /><FiPhone /><FiMail /></div></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>Copyright © {new Date().getFullYear()} Library Management System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#home" className="hover:text-brand-700">Back to top</a>
            <Link to="/login" className="hover:text-brand-700">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
