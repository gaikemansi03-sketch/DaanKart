// ========== NAVBAR AUTO-LOAD ==========
function loadNavbar() {
  const navbar = document.getElementById("navbar");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  let navHTML = `
    <header>
      <h1>DaanKart</h1>
      <nav>
        <a href="index.html">Home</a>
        <a href="donate.html">Donate</a>
        <a href="request.html">Request</a>
  `;

  if (loggedInUser) {
    if (loggedInUser.role === "admin") {
      navHTML += `<a href="dashboard.html">Dashboard</a>`;
    }
    navHTML += `
      <div id="user-menu" class="user-menu">
        <span id="username">Hi, ${loggedInUser.name} ▼</span>
        <div id="dropdown" class="dropdown">
          ${loggedInUser.role !== "admin" ? `
            <a href="my-donations.html">My Donations</a>
            <a href="my-requests.html">My Requests</a>
          ` : ""}
          <a href="#" id="logoutBtn">Logout</a>
        </div>
      </div>
    `;
  } else {
    navHTML += `
      <a href="register.html">Register</a>
      <a href="login.html">Login</a>
    `;
  }

  navHTML += `
    <button id="darkModeToggle" class="dark-toggle" title="Toggle Dark Mode">🌙</button>
  </nav>
</header>
`;

  navbar.innerHTML = navHTML;

  // Highlight active menu item
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll("nav a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  // Dropdown toggle
  const usernameEl = document.getElementById("username");
  const dropdown = document.getElementById("dropdown");
  if (usernameEl && dropdown) {
    usernameEl.addEventListener("click", () => {
      dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    });
    document.addEventListener("click", (e) => {
      if (!usernameEl.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = "none";
      }
    });
  }

  // Styled logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, logout",
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("loggedInUser");
          Swal.fire("Logged out!", "See you again soon!", "info").then(() => {
            window.location.href = "index.html";
          });
        }
      });
    });
  }
}

// ========== AUTHENTICATION ==========
function setupAuthLinks() {
  const loginLink = document.getElementById("login-link");
  const registerLink = document.getElementById("register-link");
  const logoutLink = document.getElementById("logout-link");

  const currentUser = localStorage.getItem("loggedInUser");

  if (currentUser) {
    if (loginLink) loginLink.style.display = "none";
    if (registerLink) registerLink.style.display = "none";
    if (logoutLink) logoutLink.style.display = "inline-block";
  } else {
    if (loginLink) loginLink.style.display = "inline-block";
    if (registerLink) registerLink.style.display = "inline-block";
    if (logoutLink) logoutLink.style.display = "none";
  }

  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("loggedInUser");
      Swal.fire("Logged out!", "See you again soon!", "info")
        .then(() => window.location.href = "index.html");
    });
  }
}

// ========== REGISTER ==========
function registerUser(event) {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    Swal.fire({
      icon: "error",
      title: "⚠ Missing Fields",
      text: "All fields are required!",
      confirmButtonColor: "#d33",
      background: "#fff8f0",
      color: "#333",
    });
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.find(u => u.email === email)) {
    Swal.fire({
      icon: "warning",
      title: "⚠ User Exists",
      text: "An account already exists with this email.",
      confirmButtonColor: "#f39c12",
      background: "#fff8f0",
      color: "#333",
    });
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));

  Swal.fire({
    icon: "success",
    title: "🎉 Registered Successfully!",
    text: "Please login with your credentials.",
    confirmButtonText: "Go to Login",
    confirmButtonColor: "#3085d6",
    background: "#fefefe",
    color: "#333",
    showClass: { popup: "animate__animated animate__fadeInDown" },
    hideClass: { popup: "animate__animated animate__fadeOutUp" }
  }).then(() => {
    window.location.href = "login.html";
  });
}


// ========== LOGIN ==========
function loginUser(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Admin check
  if (email === "admin@daankart.com" && password === "admin123") {
    localStorage.setItem("loggedInUser", JSON.stringify({ name: "Admin", email, role: "admin" }));
    Swal.fire({
      icon: "success",
      title: "👑 Welcome Admin!",
      text: "Redirecting to Dashboard...",
      confirmButtonColor: "#3085d6",
      background: "#fefefe",
      color: "#333",
    }).then(() => {
      window.location.href = "dashboard.html";
    });
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    Swal.fire({
      icon: "error",
      title: "🚫 Invalid Credentials",
      text: "Please check your email or password.",
      confirmButtonColor: "#d33",
      background: "#fff8f0",
      color: "#333",
    });
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify({ ...user, role: "user" }));

  Swal.fire({
    icon: "success",
    title: `🎉 Welcome, ${user.name}!`,
    text: "Login successful.",
    confirmButtonText: "Continue",
    confirmButtonColor: "#3085d6",
    background: "#fefefe",
    color: "#333",
    showClass: { popup: "animate__animated animate__fadeInDown" },
    hideClass: { popup: "animate__animated animate__fadeOutUp" }
  }).then(() => {
    window.location.href = "index.html";
  });
}


// ========== DONATION ==========
function submitDonation(e) {
  e.preventDefault();

  const itemName = document.getElementById("itemName").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    Swal.fire({
      icon: "warning",
      title: "⚠ Login Required",
      text: "You must log in to donate.",
      confirmButtonText: "Go to Login",
      confirmButtonColor: "#d33",
      background: "#fff8f0",
      color: "#333",
    }).then(() => {
      window.location.href = "login.html";
    });
    return;
  }

  let donations = JSON.parse(localStorage.getItem("donations")) || [];
  donations.push({ itemName, category, description, status: "Pending" });
  localStorage.setItem("donations", JSON.stringify(donations));

  Swal.fire({
    title: "🎉 Thank You!",
    text: "Your donation has been successfully added.",
    icon: "success",
    confirmButtonText: "View My Donations",
    confirmButtonColor: "#3085d6",
    background: "#fefefe",
    color: "#333",
    showClass: { popup: "animate__animated animate__fadeInDown" },
    hideClass: { popup: "animate__animated animate__fadeOutUp" }
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "my_donations.html";
    }
  });
}



// ========== REQUEST ==========
function submitRequest(e) {
  e.preventDefault();
  const item = document.getElementById("item").value.trim();
  const category = document.getElementById("category").value;
  const quantity = document.getElementById("quantity").value.trim();
  const location = document.getElementById("location").value.trim();

  if (!item || !category || !quantity || !location) {
    Swal.fire({
      icon: "error",
      title: "⚠ Missing Fields",
      text: "All fields are required!",
      confirmButtonColor: "#d33",
      background: "#fff8f0",
      color: "#333",
    });
    return;
  }

  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    Swal.fire({
      icon: "warning",
      title: "⚠ Login Required",
      text: "You must log in to request help.",
      confirmButtonText: "Go to Login",
      confirmButtonColor: "#d33",
      background: "#fff8f0",
      color: "#333",
    }).then(() => {
      window.location.href = "login.html";
    });
    return;
  }

  let requests = JSON.parse(localStorage.getItem("requests")) || [];
  requests.push({ itemName: item, category, quantity, location, status: "Pending" });
  localStorage.setItem("requests", JSON.stringify(requests));

  Swal.fire({
    icon: "success",
    title: "✅ Request Submitted",
    text: "Your request has been recorded successfully.",
    confirmButtonText: "View My Requests",
    confirmButtonColor: "#3085d6",
    background: "#fefefe",
    color: "#333",
    showClass: { popup: "animate__animated animate__fadeInDown" },
    hideClass: { popup: "animate__animated animate__fadeOutUp" }
  }).then(() => {
    window.location.href = "my_requests.html";
  });
}

// ========== DISPLAY DONATIONS ==========
function loadMyDonations() {
  const donations = JSON.parse(localStorage.getItem("donations")) || [];
  const tbody = document.querySelector("#my-donations tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  if (donations.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3">No donations yet. <a href="donate.html">Donate Now</a></td></tr>`;
    return;
  }
  donations.forEach(d => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${d.itemName}</td><td>${d.category}</td><td>${d.status}</td>`;
    tbody.appendChild(row);
  });
}

// ========== DISPLAY REQUESTS ==========
function loadMyRequests() {
  const requests = JSON.parse(localStorage.getItem("requests")) || [];
  const tbody = document.querySelector("#my-requests tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  if (requests.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3">No requests yet.</td></tr>`;
    return;
  }
  requests.forEach(r => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${r.itemName}</td><td>${r.category}</td><td>${r.status}</td>`;
    tbody.appendChild(row);
  });
}


// ========== ADMIN DASHBOARD ==========
function loadDashboard() {
  // ✅ Cleanup: remove all "Essentials" entries
  let donations = JSON.parse(localStorage.getItem("donations")) || [];
  donations = donations.filter(d => d.category !== "Essentials");
  localStorage.setItem("donations", JSON.stringify(donations));

  let requests = JSON.parse(localStorage.getItem("requests")) || [];
  requests = requests.filter(r => r.category !== "Essentials");
  localStorage.setItem("requests", JSON.stringify(requests));


  const donationsTbody = document.querySelector("#dashboard-donations tbody");
  const requestsTbody = document.querySelector("#dashboard-requests tbody");

  function renderDonations(filterText = "", filterCategory = "") {
    donationsTbody.innerHTML = "";
    let filtered = donations.filter(d =>
      d.itemName.toLowerCase().includes(filterText.toLowerCase()) &&
      (filterCategory === "" || d.category === filterCategory)
    );
    if (filtered.length === 0) {
      donationsTbody.innerHTML = `<tr><td colspan="4">No donations found.</td></tr>`;
    } else {
      filtered.forEach((d, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${d.itemName}</td>
          <td>${d.category}</td>
          <td>${d.status || "Pending"}</td>
          <td>
            ${d.status === "Delivered"
              ? "✔ Delivered"
              : `<button class="btn-deliver" data-type="donation" data-index="${index}">Mark as Delivered</button>`}
          </td>`;
        donationsTbody.appendChild(row);
      });
    }
  }

  function renderRequests(filterText = "", filterCategory = "") {
    requestsTbody.innerHTML = "";
    let filtered = requests.filter(r =>
      r.itemName.toLowerCase().includes(filterText.toLowerCase()) &&
      (filterCategory === "" || r.category === filterCategory)
    );
    if (filtered.length === 0) {
      requestsTbody.innerHTML = `<tr><td colspan="4">No requests found.</td></tr>`;
    } else {
      filtered.forEach((r, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${r.itemName}</td>
          <td>${r.category}</td>
          <td>${r.status || "Pending"}</td>
          <td>
            ${r.status === "Delivered"
              ? "✔ Delivered"
              : `<button class="btn-deliver" data-type="request" data-index="${index}">Mark as Delivered</button>`}
          </td>`;
        requestsTbody.appendChild(row);
      });
    }
  }

  function renderCharts() {
    if (window.donationChartInstance) window.donationChartInstance.destroy();
    if (window.requestChartInstance) window.requestChartInstance.destroy();

    // ✅ Only Clothes + Books
    const donationCategories = { Clothes: 0, Books: 0 };
    donations.forEach(d => {
      if (donationCategories[d.category] !== undefined) {
        donationCategories[d.category]++;
      }
    });

    window.donationChartInstance = new Chart(document.getElementById("donationChart"), {
      type: "pie",
      data: {
        labels: Object.keys(donationCategories),
        datasets: [{
          data: Object.values(donationCategories),
          backgroundColor: ["#0077b6", "#90e0ef"]
        }]
      }
    });

    const requestCategories = { Clothes: 0, Books: 0 };
    requests.forEach(r => {
      if (requestCategories[r.category] !== undefined) {
        requestCategories[r.category]++;
      }
    });

    window.requestChartInstance = new Chart(document.getElementById("requestChart"), {
      type: "bar",
      data: {
        labels: Object.keys(requestCategories),
        datasets: [{
          label: "Requests Count",
          data: Object.values(requestCategories),
          backgroundColor: ["#0077b6", "#90e0ef"]
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }

  // ===== Initial Render =====
  renderDonations();
  renderRequests();
  renderCharts();

  // ===== Event Listeners =====
  document.getElementById("donationSearch").addEventListener("input", (e) => {
    renderDonations(e.target.value, document.getElementById("donationFilter").value);
  });
  document.getElementById("donationFilter").addEventListener("change", (e) => {
    renderDonations(document.getElementById("donationSearch").value, e.target.value);
  });

  document.getElementById("requestSearch").addEventListener("input", (e) => {
    renderRequests(e.target.value, document.getElementById("requestFilter").value);
  });
  document.getElementById("requestFilter").addEventListener("change", (e) => {
    renderRequests(document.getElementById("requestSearch").value, e.target.value);
  });

  // ===== Mark as Delivered =====
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-deliver")) {
      const type = e.target.dataset.type;
      const index = e.target.dataset.index;
      if (type === "donation") {
        donations[index].status = "Delivered";
        localStorage.setItem("donations", JSON.stringify(donations));
        renderDonations();
      } else if (type === "request") {
        requests[index].status = "Delivered";
        localStorage.setItem("requests", JSON.stringify(requests));
        renderRequests();
      }
      renderCharts();
    }
  });

  // ===== Export CSV =====
  function exportCSV(data, filename) {
    const rows = [Object.keys(data[0]).join(","), ...data.map(d => Object.values(d).join(","))];
    const csvContent = "data:text/csv;charset=utf-8," + rows.join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  document.getElementById("exportDonations").addEventListener("click", () => {
    if (donations.length === 0) return alert("No donations to export!");
    exportCSV(donations, "donations.csv");
  });

  document.getElementById("exportRequests").addEventListener("click", () => {
    if (requests.length === 0) return alert("No requests to export!");
    exportCSV(requests, "requests.csv");
  });
}


// ========== INITIALIZE ==========
document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
  setupAuthLinks();

  // Page-specific logic
  if (document.getElementById("register-form")) {
    document.getElementById("register-form").addEventListener("submit", registerUser);
  }
  if (document.getElementById("login-form")) {
    document.getElementById("login-form").addEventListener("submit", loginUser);
  }
  if (document.getElementById("donation-form")) {
    document.getElementById("donation-form").addEventListener("submit", submitDonation);
  }
  if (document.getElementById("request-form")) {
    document.getElementById("request-form").addEventListener("submit", submitRequest);
  }
  if (document.getElementById("my-donations")) {
    loadMyDonations();
  }
  if (document.getElementById("my-requests")) {
    loadMyRequests();
  }
  if (document.getElementById("dashboard")) {
    loadDashboard();
  }

  // Dark Mode Toggle
  const darkToggle = document.getElementById("darkModeToggle");
  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("darkMode", document.body.classList.contains("dark"));
    });
  }
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }
});
