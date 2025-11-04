// State
let urls = [''];
let downloads = [];

// DOM Elements
const urlInputsContainer = document.getElementById('urlInputs');
const addUrlBtn = document.getElementById('addUrlBtn');
const prepareDownloadsBtn = document.getElementById('prepareDownloadsBtn');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const downloadQueue = document.getElementById('downloadQueue');
const downloadList = document.getElementById('downloadList');
const queueCount = document.getElementById('queueCount');
const clearAllBtn = document.getElementById('clearAllBtn');

// Initialize
renderUrlInputs();

// Event Listeners
addUrlBtn.addEventListener('click', addUrlField);
prepareDownloadsBtn.addEventListener('click', handleDownload);
clearAllBtn.addEventListener('click', clearAll);

// Functions
function renderUrlInputs() {
    urlInputsContainer.innerHTML = '';
    
    urls.forEach((url, index) => {
        const row = document.createElement('div');
        row.className = 'url-input-row';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = url;
        input.placeholder = 'https://www.youtube.com/watch?v=...';
        input.addEventListener('input', (e) => updateUrl(index, e.target.value));
        
        row.appendChild(input);
        
        if (urls.length > 1) {
            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn btn-small';
            removeBtn.innerHTML = `
                <svg class="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            `;
            removeBtn.addEventListener('click', () => removeUrlField(index));
            row.appendChild(removeBtn);
        }
        
        urlInputsContainer.appendChild(row);
    });
}

function addUrlField() {
    urls.push('');
    renderUrlInputs();
}

function removeUrlField(index) {
    urls = urls.filter((_, i) => i !== index);
    if (urls.length === 0) {
        urls = [''];
    }
    renderUrlInputs();
}

function updateUrl(index, value) {
    urls[index] = value;
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function extractVideoId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
        /youtube\.com\/embed\/([^&\n?#]+)/,
        /youtube\.com\/v\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) return match[1];
    }
    return null;
}

function handleDownload() {
    hideError();
    const validUrls = urls.filter(url => url.trim() !== '');
    
    if (validUrls.length === 0) {
        showError('Please enter at least one YouTube URL');
        return;
    }

    const newDownloads = [];
    
    for (const url of validUrls) {
        const videoId = extractVideoId(url);
        
        if (!videoId) {
            showError(`Invalid YouTube URL: ${url}`);
            continue;
        }

        newDownloads.push({
            id: videoId,
            url: url,
            status: 'ready',
            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            downloadLink: `https://www.y2mate.com/youtube/${videoId}`
        });
    }

    downloads = [...downloads, ...newDownloads];
    urls = [''];
    renderUrlInputs();
    renderDownloads();
}

function renderDownloads() {
    if (downloads.length === 0) {
        downloadQueue.classList.add('hidden');
        return;
    }

    downloadQueue.classList.remove('hidden');
    queueCount.textContent = downloads.length;
    downloadList.innerHTML = '';

    downloads.forEach((download) => {
        const item = document.createElement('div');
        item.className = 'download-item';
        
        item.innerHTML = `
            <img src="${download.thumbnail}" alt="Video thumbnail" class="download-thumbnail">
            <div class="download-info">
                <p class="download-url">${download.url}</p>
                <p class="download-id">Video ID: ${download.id}</p>
            </div>
            <div class="download-actions">
                <a href="${download.downloadLink}" target="_blank" rel="noopener noreferrer" class="btn btn-download">
                    Download
                </a>
                <button class="btn btn-small" onclick="removeDownload('${download.id}')">
                    <svg class="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;
        
        downloadList.appendChild(item);
    });
}

function removeDownload(id) {
    downloads = downloads.filter(d => d.id !== id);
    renderDownloads();
}

function clearAll() {
    downloads = [];
    urls = [''];
    hideError();
    renderUrlInputs();
    renderDownloads();
}