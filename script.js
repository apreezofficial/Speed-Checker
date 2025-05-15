// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const startTestBtn = document.getElementById('startTestBtn');
const shareResultsBtn = document.getElementById('shareResultsBtn');
const saveResultsBtn = document.getElementById('saveResultsBtn');
const progressBar = document.getElementById('progressBar');
const downloadSpeed = document.getElementById('downloadSpeed');
const uploadSpeed = document.getElementById('uploadSpeed');
const pingValue = document.getElementById('pingValue');
const jitterValue = document.getElementById('jitterValue');
const maxSpeedLabel = document.getElementById('maxSpeedLabel');
const historyList = document.getElementById('historyList');
const ipAddress = document.getElementById('ipAddress');
const ispInfo = document.getElementById('ispInfo');
const locationInfo = document.getElementById('locationInfo');
const serverInfo = document.getElementById('serverInfo');
const statusIndicator = document.getElementById('statusIndicator');
const connectionStatus = document.getElementById('connectionStatus');

// Helper function to get CSS variables
const getCssVar = (name) => getComputedStyle(document.body).getPropertyValue(name).trim();

// Chart initialization
const ctx = document.getElementById('speedChart').getContext('2d');
let speedChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Download (Mbps)',
                data: [],
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Upload (Mbps)',
                data: [],
                borderColor: '#4cc9f0',
                backgroundColor: 'rgba(76, 201, 240, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: getCssVar('--text-color')
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: getCssVar('--text-color')
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                ticks: {
                    color: getCssVar('--text-color')
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        }
    }
});

// Update chart colors when theme changes
function updateChartColors() {
    const textColor = getCssVar('--text-color');
    const gridColor = 'rgba(0, 0, 0, 0.1)';
    
    speedChart.options.plugins.legend.labels.color = textColor;
    speedChart.options.scales.y.ticks.color = textColor;
    speedChart.options.scales.x.ticks.color = textColor;
    
    speedChart.update();
}

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    document.body.setAttribute('data-theme', 
        document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    
    // Update icon
    const icon = themeToggle.querySelector('i');
    if (document.body.getAttribute('data-theme') === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
    
    // Update chart colors
    updateChartColors();
});

// Check connection status
function checkConnection() {
    connectionStatus.textContent = "Checking connection...";
    statusIndicator.className = "status-indicator";
    
    // Simulate connection check
    setTimeout(() => {
        if (Math.random() > 0.1) { // 90% chance of being online for demo purposes
            statusIndicator.classList.add("online");
            connectionStatus.textContent = "You're online. Ready to test!";
        } else {
            statusIndicator.classList.add("offline");
            connectionStatus.textContent = "You're offline. Please check your connection.";
            startTestBtn.disabled = true;
        }
    }, 1500);
}

// Fetch IP and location information
async function fetchNetworkInfo() {
    try {
        // Simulated response
        const mockData = {
            ip: "192.168." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255),
            isp: ["Comcast", "Verizon", "AT&T", "Spectrum", "Google Fiber"][Math.floor(Math.random() * 5)],
            city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][Math.floor(Math.random() * 5)],
            region: ["NY", "CA", "IL", "TX", "AZ"][Math.floor(Math.random() * 5)],
            country: "US"
        };
        
        ipAddress.textContent = mockData.ip;
        ispInfo.textContent = mockData.isp;
        locationInfo.textContent = `${mockData.city}, ${mockData.region}, ${mockData.country}`;
        serverInfo.textContent = `${mockData.isp} - ${mockData.city}`;
    } catch (error) {
        console.error("Error fetching network info:", error);
        ipAddress.textContent = "Error";
        ispInfo.textContent = "Error";
        locationInfo.textContent = "Error";
    }
}

// Speed test simulation
async function runSpeedTest() {
    startTestBtn.disabled = true;
    startTestBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
    startTestBtn.classList.add('testing');
    
    // Reset values
    downloadSpeed.textContent = "--";
    uploadSpeed.textContent = "--";
    pingValue.textContent = "--";
    jitterValue.textContent = "--";
    progressBar.style.width = "0%";
    
    // Simulate ping test
    const ping = Math.floor(Math.random() * 50) + 5;
    const jitter = Math.floor(Math.random() * 10) + 1;
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    pingValue.textContent = ping;
    jitterValue.textContent = jitter;
    
    // Simulate download test
    const maxDownload = Math.floor(Math.random() * 300) + 50;
    maxSpeedLabel.textContent = `${maxDownload} Mbps`;
    
    let downloadProgress = 0;
    const downloadInterval = setInterval(() => {
        downloadProgress += Math.floor(Math.random() * 10) + 5;
        if (downloadProgress > 100) downloadProgress = 100;
        
        progressBar.style.width = `${downloadProgress}%`;
        const currentSpeed = Math.floor((downloadProgress / 100) * maxDownload);
        downloadSpeed.textContent = currentSpeed;
        
        if (downloadProgress === 100) {
            clearInterval(downloadInterval);
            simulateUploadTest();
        }
    }, 200);
}

function simulateUploadTest() {
    const maxUpload = Math.floor(parseInt(downloadSpeed.textContent) * 0.3 + Math.random() * 10);
    
    let uploadProgress = 0;
    const uploadInterval = setInterval(() => {
        uploadProgress += Math.floor(Math.random() * 10) + 5;
        if (uploadProgress > 100) uploadProgress = 100;
        
        const currentSpeed = Math.floor((uploadProgress / 100) * maxUpload);
        uploadSpeed.textContent = currentSpeed;
        
        if (uploadProgress === 100) {
            clearInterval(uploadInterval);
            completeSpeedTest();
        }
    }, 200);
}

function completeSpeedTest() {
    startTestBtn.innerHTML = '<i class="fas fa-play"></i> Test Again';
    startTestBtn.disabled = false;
    startTestBtn.classList.remove('testing');
    shareResultsBtn.disabled = false;
    saveResultsBtn.disabled = false;
    
    // Save to history
    saveTestToHistory();
}

function saveTestToHistory() {
    const now = new Date();
    const dateString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    const download = downloadSpeed.textContent;
    const upload = uploadSpeed.textContent;
    const ping = pingValue.textContent;
    
    // Add to chart data
    speedChart.data.labels.push(dateString);
    speedChart.data.datasets[0].data.push(parseInt(download));
    speedChart.data.datasets[1].data.push(parseInt(upload));
    
    // Limit to 10 entries for demo purposes
    if (speedChart.data.labels.length > 10) {
        speedChart.data.labels.shift();
        speedChart.data.datasets[0].data.shift();
        speedChart.data.datasets[1].data.shift();
    }
    
    speedChart.update();
    
    // Add to history list
    if (historyList.querySelector('p')) {
        historyList.innerHTML = '';
    }
    
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <div class="history-date">${dateString}</div>
        <div class="history-speed">
            <span class="speed-value"><i class="fas fa-download" style="color: #4361ee;"></i> ${download} Mbps</span>
            <span class="speed-value"><i class="fas fa-upload" style="color: #4cc9f0;"></i> ${upload} Mbps</span>
        </div>
    `;
    
    historyList.prepend(historyItem);
}

// Event listeners
startTestBtn.addEventListener('click', runSpeedTest);
shareResultsBtn.addEventListener('click', () => {
    alert('Abeg Calms nah');
});
saveResultsBtn.addEventListener('click', () => {
    alert('Abeg Calms nah, still on it.');
});

// Initialize
checkConnection();
fetchNetworkInfo();
