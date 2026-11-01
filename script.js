const jobs = [
  { id: 1, title: "Frontend Developer Intern", company: "PixelCraft Labs", location: "Remote", type: "Internship", experience: "Fresher", salary: "₹8k–15k / month", skills: ["HTML", "CSS", "JavaScript"], description: "Help build responsive product interfaces, fix UI issues, and collaborate with a small engineering team.", url: "https://www.linkedin.com/jobs/" },
  { id: 2, title: "Software Engineer Intern", company: "NovaByte Systems", location: "Bengaluru", type: "Internship", experience: "Fresher", salary: "₹15k–25k / month", skills: ["C++", "DSA", "Git"], description: "Work on engineering tasks, write clean code, and learn testing and code review practices.", url: "https://www.linkedin.com/jobs/" },
  { id: 3, title: "React Developer", company: "BrightLoop Tech", location: "Remote", type: "Remote", experience: "0-1 year", salary: "₹4–7 LPA", skills: ["React", "JavaScript", "REST API"], description: "Build reusable components and connect frontend views to backend APIs in a remote team.", url: "https://www.naukri.com/" },
  { id: 4, title: "Python Developer Intern", company: "DataNest AI", location: "Hyderabad", type: "Internship", experience: "Fresher", salary: "₹10k–18k / month", skills: ["Python", "SQL", "APIs"], description: "Support Python automation and data tasks while learning practical software development workflows.", url: "https://www.linkedin.com/jobs/" },
  { id: 5, title: "Junior Web Developer", company: "Orbit Digital", location: "Delhi NCR", type: "Full-time", experience: "0-1 year", salary: "₹3–5 LPA", skills: ["HTML", "CSS", "JavaScript"], description: "Create and maintain websites, improve accessibility, and troubleshoot frontend bugs.", url: "https://www.naukri.com/" },
  { id: 6, title: "Backend Developer Intern", company: "CloudSpring", location: "Pune", type: "Internship", experience: "Fresher", salary: "₹12k–20k / month", skills: ["Node.js", "MongoDB", "Express"], description: "Learn to create REST APIs, validate incoming data, and work with database-backed features.", url: "https://www.linkedin.com/jobs/" },
  { id: 7, title: "Graduate Engineer Trainee", company: "TechBridge India", location: "Bengaluru", type: "Full-time", experience: "Fresher", salary: "₹4–6 LPA", skills: ["Problem solving", "OOP", "SQL"], description: "Start your engineering career with structured training, team projects, and mentorship.", url: "https://www.naukri.com/" },
  { id: 8, title: "QA Automation Intern", company: "QualityGrid", location: "Remote", type: "Remote", experience: "0-1 year", salary: "₹8k–14k / month", skills: ["JavaScript", "Testing", "Git"], description: "Help write test cases, reproduce bugs, and explore automated testing for web applications.", url: "https://www.linkedin.com/jobs/" },
  { id: 9, title: "Full Stack Developer", company: "CodeHarbor", location: "Hyderabad", type: "Full-time", experience: "1-2 years", salary: "₹6–10 LPA", skills: ["React", "Node.js", "MongoDB"], description: "Contribute to end-to-end features and collaborate on frontend, API, and database work.", url: "https://www.naukri.com/" }
];

const $ = (id) => document.getElementById(id);
const STORAGE = {
  saved: "careerTrackSavedJobs",
  applications: "careerTrackApplications",
  checklist: "careerTrackChecklist",
  weekly: "careerTrackWeekly"
};
const read = (key, fallback) => {
  try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; }
  catch { return fallback; }
};
let savedJobs = read(STORAGE.saved, []);
let applications = read(STORAGE.applications, []);
let checklist = read(STORAGE.checklist, {});
let weekly = read(STORAGE.weekly, {});
let toastTimer;

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
function saveState() {
  localStorage.setItem(STORAGE.saved, JSON.stringify(savedJobs));
  localStorage.setItem(STORAGE.applications, JSON.stringify(applications));
  localStorage.setItem(STORAGE.checklist, JSON.stringify(checklist));
  localStorage.setItem(STORAGE.weekly, JSON.stringify(weekly));
}
function notify(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}
function jobCard(job) {
  const isSaved = savedJobs.includes(job.id);
  return `<article class="job-card">
    <div class="job-card-top"><div class="company-logo">${escapeHTML(job.company.slice(0, 1))}</div><button class="save-btn ${isSaved ? "saved" : ""}" data-save="${job.id}" aria-label="${isSaved ? "Unsave" : "Save"} ${escapeHTML(job.title)}">${isSaved ? "♥" : "♡"}</button></div>
    <h3>${escapeHTML(job.title)}</h3><p class="company-name">${escapeHTML(job.company)}</p>
    <div class="job-tags"><span class="tag type">${escapeHTML(job.type)}</span><span class="tag">${escapeHTML(job.experience)}</span><span class="tag">${escapeHTML(job.location)}</span></div>
    <p class="job-description">${escapeHTML(job.description)}</p>
    <div class="job-meta"><span>Location<br><strong>${escapeHTML(job.location)}</strong></span><span>Compensation<br><strong>${escapeHTML(job.salary)}</strong></span></div>
    <div class="job-actions"><button class="btn btn-primary" data-track="${job.id}">Track application</button><a class="btn btn-outline" href="${escapeHTML(job.url)}" target="_blank" rel="noreferrer">Explore ↗</a></div>
  </article>`;
}
function compactJob(job) {
  return `<div class="compact-job"><div class="company-logo">${escapeHTML(job.company.slice(0, 1))}</div><div class="compact-job-main"><strong>${escapeHTML(job.title)}</strong><small>${escapeHTML(job.company)} · ${escapeHTML(job.location)}</small></div><button class="mini-save" data-save="${job.id}" aria-label="Save job">${savedJobs.includes(job.id) ? "♥" : "♡"}</button></div>`;
}
function renderJobs() {
  const query = $("searchInput").value.trim().toLowerCase();
  const type = $("jobTypeFilter").value;
  const location = $("locationFilter").value;
  const experience = $("experienceFilter").value;
  const filtered = jobs.filter(job => {
    const matchesQuery = [job.title, job.company, job.location, ...job.skills].join(" ").toLowerCase().includes(query);
    const matchesType = type === "All" || job.type === type;
    const matchesLocation = location === "All" || job.location === location;
    const matchesExperience = experience === "All" || job.experience === experience;
    return matchesQuery && matchesType && matchesLocation && matchesExperience;
  });
  $("jobCount").textContent = `Showing ${filtered.length} of ${jobs.length} opportunities`;
  $("jobList").innerHTML = filtered.length ? filtered.map(jobCard).join("") : `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">⌕</div><h3>No matching opportunities</h3><p>Try another keyword or clear the filters.</p></div>`;
}
function renderSaved() {
  const selected = jobs.filter(job => savedJobs.includes(job.id));
  $("savedCount").textContent = `${selected.length} saved`;
  $("savedJobsList").innerHTML = selected.map(jobCard).join("");
  $("savedEmpty").classList.toggle("hidden", selected.length > 0);
  $("navSavedCount").textContent = selected.length;
  $("savedJobsStat").textContent = selected.length;
}
function renderDashboard() {
  $("totalJobsStat").textContent = jobs.length;
  $("applicationStat").textContent = applications.length;
  $("interviewStat").textContent = applications.filter(app => app.status === "Interview").length;
  $("dashboardJobs").innerHTML = jobs.slice(0, 4).map(compactJob).join("");
  const date = new Date();
  $("todayLabel").textContent = date.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
  document.querySelectorAll("[data-check]").forEach(input => input.checked = Boolean(checklist[input.dataset.check]));
  const completed = Object.values(checklist).filter(Boolean).length;
  $("checkProgressBar").style.width = `${Math.min(completed, 4) / 4 * 100}%`;
  $("checkProgressText").textContent = `${Math.min(completed, 4)} of 4 completed`;
}
function renderApplications() {
  const filter = $("applicationStatusFilter").value;
  const filtered = applications.filter(app => filter === "All" || app.status === filter);
  $("applicationCount").textContent = `${filtered.length} application${filtered.length === 1 ? "" : "s"}`;
  $("applicationsEmpty").classList.toggle("hidden", applications.length > 0);
  $("applicationList").innerHTML = filtered.map(app => {
    const statusClass = app.status.toLowerCase();
    return `<tr><td><strong>${escapeHTML(app.role)}</strong><small>${escapeHTML(app.company)}</small></td><td>${escapeHTML(app.date)}</td><td><span class="status-pill ${statusClass}">${escapeHTML(app.status)}</span></td><td>${escapeHTML(app.notes || "—")}</td><td><button class="table-action" data-delete-app="${app.id}">Delete</button></td></tr>`;
  }).join("");
  if (!filtered.length && applications.length) $("applicationList").innerHTML = `<tr><td colspan="5">No applications match this status.</td></tr>`;
}
function renderWeekly() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  $("weeklyDays").innerHTML = days.map(day => `<label class="day-check"><input type="checkbox" data-week="${day}" ${weekly[day] ? "checked" : ""}><span>${day}</span></label>`).join("");
}
function renderAll() {
  renderJobs(); renderSaved(); renderDashboard(); renderApplications(); renderWeekly();
}
function toggleSave(id) {
  if (savedJobs.includes(id)) {
    savedJobs = savedJobs.filter(savedId => savedId !== id);
    notify("Removed from saved jobs");
  } else {
    savedJobs.push(id);
    notify("Job saved to your shortlist");
  }
  saveState(); renderAll();
}
function trackJob(id) {
  const job = jobs.find(item => item.id === id);
  if (!job) return;
  $("appRole").value = job.title;
  $("appCompany").value = job.company;
  $("appStatus").value = "Applied";
  $("appDate").value = new Date().toISOString().slice(0, 10);
  $("appNotes").value = "Added from CareerTrack job list";
  location.hash = "applications";
  $("appRole").focus({ preventScroll: true });
  notify("Job details added to the application form");
}
$("searchInput").addEventListener("input", renderJobs);
["jobTypeFilter", "locationFilter", "experienceFilter"].forEach(id => $(id).addEventListener("change", renderJobs));
$("clearFilters").addEventListener("click", () => {
  $("searchInput").value = "";
  $("jobTypeFilter").value = "All";
  $("locationFilter").value = "All";
  $("experienceFilter").value = "All";
  renderJobs();
});
document.addEventListener("click", event => {
  const saveButton = event.target.closest("[data-save]");
  if (saveButton) toggleSave(Number(saveButton.dataset.save));
  const trackButton = event.target.closest("[data-track]");
  if (trackButton) trackJob(Number(trackButton.dataset.track));
  const deleteButton = event.target.closest("[data-delete-app]");
  if (deleteButton) {
    applications = applications.filter(app => app.id !== Number(deleteButton.dataset.deleteApp));
    saveState(); renderAll(); notify("Application removed");
  }
});
$("applicationForm").addEventListener("submit", event => {
  event.preventDefault();
  const app = {
    id: Date.now(),
    role: $("appRole").value.trim(),
    company: $("appCompany").value.trim(),
    status: $("appStatus").value,
    date: $("appDate").value,
    notes: $("appNotes").value.trim()
  };
  if (!app.role || !app.company || !app.date) return;
  applications.unshift(app);
  saveState(); renderAll();
  $("applicationForm").reset();
  $("appDate").value = new Date().toISOString().slice(0, 10);
  notify("Application added to your tracker");
});
$("applicationStatusFilter").addEventListener("change", renderApplications);
document.querySelectorAll("[data-check]").forEach(input => input.addEventListener("change", () => {
  checklist[input.dataset.check] = input.checked;
  saveState(); renderDashboard();
}));
$("weeklyDays").addEventListener("change", event => {
  if (event.target.matches("[data-week]")) {
    weekly[event.target.dataset.week] = event.target.checked;
    saveState();
    notify(event.target.checked ? `${event.target.dataset.week} marked complete` : "Weekly task unchecked");
  }
});
$("menuToggle").addEventListener("click", () => $("mainNav").classList.toggle("open"));
document.querySelectorAll(".nav-link").forEach(link => link.addEventListener("click", () => {
  document.querySelectorAll(".nav-link").forEach(item => item.classList.remove("active"));
  link.classList.add("active");
  $("mainNav").classList.remove("open");
}));
window.addEventListener("hashchange", () => {
  const page = location.hash.replace("#", "") || "dashboard";
  document.querySelectorAll(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.page === page));
});
$("appDate").value = new Date().toISOString().slice(0, 10);
renderAll();
