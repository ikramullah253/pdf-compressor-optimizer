
const fileInput = document.getElementById("pdfFile");
const dropZone = document.getElementById("dropZone");
const chooseBtn = document.getElementById("chooseBtn");
const compressBtn = document.getElementById("compressBtn");
const fileInfo = document.getElementById("fileInfo");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const removeFileBtn = document.getElementById("removeFileBtn");
const levelButtons = document.querySelectorAll(".level-btn");

const loadingModule = document.getElementById("loading");
const resultModule = document.getElementById("result");
const statusNotification = document.getElementById("status");
const downloadLink = document.getElementById("downloadLink");
const resetBtn = document.getElementById("resetBtn");


const originalSizeDisplay = document.getElementById("originalSize");
const compressedSizeDisplay = document.getElementById("compressedSize");
const savedPercentDisplay = document.getElementById("savedPercent");


let selectedFilePointer = null;
let chosenQualityProfile = "ebook"; 


levelButtons.forEach(buttonElement => {
    buttonElement.addEventListener("click", () => {
        levelButtons.forEach(btn => btn.classList.remove("active"));
        buttonElement.classList.add("active");
        chosenQualityProfile = buttonElement.getAttribute("data-quality");
    });
});


chooseBtn.addEventListener("click", (eventObject) => {
    eventObject.stopPropagation();
    fileInput.click();
});

dropZone.addEventListener("click", () => {
    if (!selectedFilePointer) fileInput.click();
});

fileInput.addEventListener("change", (eventObject) => {
    if (eventObject.target.files.length > 0) {
        evaluateAndIngestFile(eventObject.target.files[0]);
    }
});

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
    }, false);
});

dropZone.addEventListener('drop', (e) => {
    const dataTransferInstance = e.dataTransfer;
    const filesUploadedList = dataTransferInstance.files;
    if (filesUploadedList.length > 0) {
        evaluateAndIngestFile(filesUploadedList[0]);
    }
});


function evaluateAndIngestFile(targetFileInstance) {
    clearNotificationField();
    resultModule.classList.add("hidden");

    
    if (targetFileInstance.type !== "application/pdf" && !targetFileInstance.name.toLowerCase().endsWith('.pdf')) {
        renderNotificationBox("Error: Unsupported file format detected. Only valid PDF files can be loaded.", "#ef4444");
        return;
    }

    const byteLimitBenchmark = 10 * 1024 * 1024; 
    if (targetFileInstance.size > byteLimitBenchmark) {
        renderNotificationBox("Error: Document file package context exceeds the maximum allowed 10 MB limit.", "#ef4444");
        return;
    }

    selectedFilePointer = targetFileInstance;
    
    fileName.textContent = targetFileInstance.name;
    fileSize.textContent = conversionBytesStringFormat(targetFileInstance.size);
    
    dropZone.classList.add("hidden");
    fileInfo.classList.remove("hidden");
    
    compressBtn.removeAttribute("disabled");
}

removeFileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    performUploadSectionReset();
});

resetBtn.addEventListener("click", () => {
    performUploadSectionReset();
    resultModule.classList.add("hidden");
});

function performUploadSectionReset() {
    selectedFilePointer = null;
    fileInput.value = "";
    
    fileInfo.classList.add("hidden");
    dropZone.classList.remove("hidden");
    
    compressBtn.setAttribute("disabled", "true");
    clearNotificationField();
}


compressBtn.addEventListener("click", async () => {
    if (!selectedFilePointer) return;

    loadingModule.classList.remove("hidden");
    resultModule.classList.add("hidden");
    compressBtn.setAttribute("disabled", "true");
    clearNotificationField();

    const multipartFormPayload = new FormData();
    multipartFormPayload.append("pdf", selectedFilePointer); 
    multipartFormPayload.append("quality", chosenQualityProfile);

    try {
        const networkResponseStream = await fetch("/compress", { 
            method: "POST",
            body: multipartFormPayload
        });

        const parsedJSONDataResponse = await networkResponseStream.json();

        
        if (networkResponseStream.ok && parsedJSONDataResponse.success) {
            loadingModule.classList.add("hidden");
            resultModule.classList.remove("hidden");

            originalSizeDisplay.textContent = conversionBytesStringFormat(parsedJSONDataResponse.originalSize);
            compressedSizeDisplay.textContent = conversionBytesStringFormat(parsedJSONDataResponse.compressedSize);
            savedPercentDisplay.textContent = parsedJSONDataResponse.savedPercent + "%";
            
            downloadLink.href = parsedJSONDataResponse.download; 
            compressBtn.removeAttribute("disabled");
        } else {
            throw new Error(parsedJSONDataResponse.error || "An unexpected error occurred during compression lifecycle execution.");
        }

    } catch (networkProcessingErrorInstance) {
        loadingModule.classList.add("hidden");
        compressBtn.removeAttribute("disabled");
        renderNotificationBox(networkProcessingErrorInstance.message || "Failed to establish a valid dynamic interface bridge with server.", "#ef4444");
    }
});


function conversionBytesStringFormat(bytesIntegerAmount, decimalPrecisionDigits = 2) {
    if (bytesIntegerAmount === 0) return '0 Bytes';
    const binaryBaseKiloScale = 1024;
    const precisionClampVal = decimalPrecisionDigits < 0 ? 0 : decimalPrecisionDigits;
    const sizeSymbolMatrix = ['Bytes', 'KB', 'MB', 'GB'];
    const logsCalculationFactor = Math.floor(Math.log(bytesIntegerAmount) / Math.log(binaryBaseKiloScale));
    return parseFloat((bytesIntegerAmount / Math.pow(binaryBaseKiloScale, logsCalculationFactor)).toFixed(precisionClampVal)) + ' ' + sizeSymbolMatrix[logsCalculationFactor];
}


function renderNotificationBox(textBodyStringMessage, hexColorStringCode) {
    statusNotification.textContent = textBodyStringMessage;
    statusNotification.style.color = hexColorStringCode;
}

function clearNotificationField() {
    statusNotification.textContent = "";
}
