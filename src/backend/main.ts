import { bootstrapCameraKit } from '@snap/camera-kit';

(async function () {
    const cameraKit = await bootstrapCameraKit({ apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjg3NDQxNTg4LCJzdWIiOiI0YzVlNzk3ZS0zMThhLTRhZjgtYjk3YS1kNDE0MDI2NTg0OTR-U1RBR0lOR341OTc4OTNkMy02MDBlLTQ3YWMtOTA4Yi1kODBlMjM2YjNiOTAifQ.6D9P9OvyeV4Fv6TwBHVwLZ8wPPctErzae6_Qa4vmGR8' });
    const liveRenderTarget = document.getElementById('canvas') as HTMLCanvasElement;
    const session = await cameraKit.createSession({ liveRenderTarget });

    const videoConstraints = {
        width: { ideal: 720 },
        aspectRatio: 16 / 9
    };

    const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints
    });
    console.log(mediaStream);
    await session.setSource(mediaStream);
    await session.play();

    const lens = await cameraKit.lensRepository.loadLens(
        '22a6e79d-adee-4d2d-b6e9-0925e6cc3ffa',
        'c15f86ce-6781-4a19-bca1-bd87f4a546a2'
    );
    await session.applyLens(lens);

    let recorder: MediaRecorder;
    let data: Blob[] = [];

    function startRecording() {
        const canvasStream = liveRenderTarget.captureStream(30);
        recorder = new MediaRecorder(canvasStream);

        recorder.ondataavailable = event => data.push(event.data);
        recorder.onerror = (error) => {
            console.error('Recorder Error:', error);
        };
        recorder.onstop = async () => { // Made this an async function
            console.log('Recording stopped');

            const blob = new Blob(data, { type: 'video/webm' });
            const formData = new FormData();
            formData.append('video', blob, 'recorded-video.webm');

            try {
                const response = await fetch('/upload-video', {
                    method: 'POST',
                    body: formData,
                });
                const result = await response.json();
                console.log(result.message);
            } catch (error) {
                console.error('Upload failed:', error);
            }
        };

        recorder.start();
        console.log('Recording started');
    }

    // Setup UI elements
    const startButton = document.createElement('button');
    startButton.className = 'start-button';
    startButton.textContent = 'Record';
    document.body.appendChild(startButton);
    startButton.addEventListener('click', startRecording);

    const stopButton = document.createElement('button');
    stopButton.textContent = 'Stop';
    document.body.appendChild(stopButton);
    stopButton.addEventListener('click', () => {
        if (recorder && recorder.state === 'recording') {
            recorder.stop();
        }
    });

    // Style setup (omitted for brevity)
})();
