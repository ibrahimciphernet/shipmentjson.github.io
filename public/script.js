// Navigation functionality
document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const trackButton = document.getElementById("trackButton");
    const trackingInput = document.getElementById("trackingInput");
    const contactForm = document.getElementById("contactForm");

    // Mobile menu toggle
    hamburger.addEventListener("click", function () {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const sectionName = this.getAttribute("data-section");
            showSection(sectionName);

            // Update active nav link
            navLinks.forEach(l => l.classList.remove("active"));
            this.classList.add("active");

            // Close mobile menu
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        });
    });

    // Tracking functionality
    trackButton.addEventListener("click", trackPackage);
    trackingInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            trackPackage();
        }
    });

    // Contact form submission
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        showContactSuccess();
    });

    // Handle footer links
    const footerLinks = document.querySelectorAll(".footer-section a");
    footerLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const sectionName = this.getAttribute("href").substring(1);
            showSection(sectionName);

            // Update active nav link
            navLinks.forEach(l => l.classList.remove("active"));
            const correspondingNavLink = document.querySelector(`.nav-link[data-section="${sectionName}"]`);
            if(correspondingNavLink) {
                correspondingNavLink.classList.add("active");
            }
        });
    });
});

// Show specific section
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll(".section");
    sections.forEach(section => {
        section.classList.remove("active");
    });

    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add("active");
    }

    // Update URL hash
    window.location.hash = sectionName;
}

// Track package function
async function trackPackage() {
    const trackingCode = document.getElementById("trackingInput").value.trim();
    const resultDiv = document.getElementById("trackingResult");
    const errorDiv = document.getElementById("errorMessage");
    const packageDetails = document.getElementById("packageDetails");
    const progressSection = document.getElementById("progressSection");

    // Clear previous results
    resultDiv.classList.remove("hidden");
    errorDiv.classList.add("hidden");
    packageDetails.classList.add("hidden");
    progressSection.classList.add("hidden");

    if (!trackingCode) {
        showError("Please enter a tracking code.");
        return;
    }

    // Show loading state
    document.getElementById("trackButton").textContent = "Tracking...";
    document.getElementById("trackButton").disabled = true;

    try {
        // Fetch data from JSON file
        const response = await fetch("./data/shipment_data.json");
        const data = await response.json();

        // Reset button
        document.getElementById("trackButton").textContent = "Track Package";
        document.getElementById("trackButton").disabled = false;

        if (data[trackingCode]) {
            displayPackageInfo(data[trackingCode]);
        } else {
            showError("Tracking code not found. Please check your code and try again.");
        }
    } catch (error) {
        console.error("Error fetching tracking data:", error);
        showError("Failed to fetch tracking data. Please try again later.");

        // Reset button
        document.getElementById("trackButton").textContent = "Track Package";
        document.getElementById("trackButton").disabled = false;
    }
}

// Display package information
function displayPackageInfo(shipmentData) {
    // Show package details
    document.getElementById("packageDescription").textContent = shipmentData.package_description;
    document.getElementById("packageOrigin").textContent = shipmentData.origin;
    document.getElementById("packageDestination").textContent = shipmentData.destination;
    document.getElementById("packageDelivery").textContent = shipmentData.estimated_delivery;
    document.getElementById("packageLocation").textContent = shipmentData.current_location;
    document.getElementById('packageNotes').textContent = shipmentData.notes;
    document.getElementById('packageWeight').textContent = shipmentData.Weight;
    document.getElementById('packageDimensions').textContent = shipmentData.Dimensions;
    document.getElementById('packageContents').textContent = shipmentData.Contents;
    document.getElementById('packageShippingCost').textContent = shipmentData.Shipping_cost;
    document.getElementById('packageTotalPaid').textContent = shipmentData.Total_Paid;
    document.getElementById("packageDetails").classList.remove("hidden");

    // Show progress
    displayProgress(shipmentData.progress);
    document.getElementById("progressSection").classList.remove("hidden");
}

// Display progress information
function displayProgress(progressData) {
    const progressFill = document.getElementById("progressFill");
    const steps = document.querySelectorAll(".step");
    const historyList = document.getElementById("historyList");

    // Calculate progress percentage
    const totalSteps = 5;
    const currentStep = progressData.length;
    const progressPercentage = (currentStep / totalSteps) * 100;

    // Update progress bar
    setTimeout(() => {
        progressFill.style.width = progressPercentage + "%";
    }, 100);

    // Update step indicators
    steps.forEach((step, index) => {
        if (index < currentStep) {
            step.classList.add("active");
        } else {
            step.classList.remove("active");
        }
    });

    // Display tracking history
    historyList.innerHTML = "";
    progressData.forEach((item, index) => {
        const historyItem = document.createElement("div");
        historyItem.className = "history-item";
        historyItem.innerHTML = `
            <div class="history-dot"></div>
            <div class="history-content">
                <div class="history-status">${item.status}</div>
                <div class="history-location">${item.location}</div>
            </div>
            <div class="history-date">${item.date}</div>
        `;
        historyList.appendChild(historyItem);
    });
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById("errorMessage");
    const errorText = document.getElementById("errorText");

    errorText.textContent = message;
    errorDiv.classList.remove("hidden");
}

// Track sample codes
function trackSample(code) {
    document.getElementById("trackingInput").value = code;
    trackPackage();
}

// Contact form success
function showContactSuccess() {
    const form = document.getElementById("contactForm");
    const formData = new FormData(form);

    // Simulate form submission
    const submitButton = form.querySelector("button[type=\"submit\"]");
    const originalText = submitButton.textContent;

    submitButton.textContent = "Sending...";
    submitButton.disabled = true;

    setTimeout(() => {
        alert("Thank you for your message! We will get back to you within 24 hours.");
        form.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1000);
}

// Handle initial page load
window.addEventListener("load", function () {
    const hash = window.location.hash.substring(1);
    const validSections = ["home", "tracking", "contact", "help", "faq", "terms", "privacy"];
    if (hash && validSections.includes(hash)) {
        showSection(hash);

        // Update active nav link
        const navLinks = document.querySelectorAll(".nav-link");
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("data-section") === hash) {
                link.classList.add("active");
            }
        });
    } else {
        showSection("home");
    }
});

// Handle browser back/forward buttons
window.addEventListener("hashchange", function () {
    const hash = window.location.hash.substring(1);
    const validSections = ["home", "tracking", "contact", "help", "faq", "terms", "privacy"];
    if (hash && validSections.includes(hash)) {
        showSection(hash);

        // Update active nav link
        const navLinks = document.querySelectorAll(".nav-link");
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("data-section") === hash) {
                link.classList.add("active");
            }
        });
    }
});
