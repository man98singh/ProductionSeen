import { bootstrapCameraKit } from '@snap/camera-kit';

(async function () {
    const cameraKit = await bootstrapCameraKit({ apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjg3NDQxNTg4LCJzdWIiOiI0YzVlNzk3ZS0zMThhLTRhZjgtYjk3YS1kNDE0MDI2NTg0OTR-U1RBR0lOR341OTc4OTNkMy02MDBlLTQ3YWMtOTA4Yi1kODBlMjM2YjNiOTAifQ.6D9P9OvyeV4Fv6TwBHVwLZ8wPPctErzae6_Qa4vmGR8' });
    const liveRenderTarget = document.getElementById('canvas') as HTMLCanvasElement;
    const session = await cameraKit.createSession({ liveRenderTarget });

    // Set video constraints to 1280x720 (16:9 aspect ratio)
    const videoConstraints = {
        width: { ideal: 720 },
        
        aspectRatio: 16 / 9
    };

    const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints
    });

    await session.setSource(mediaStream);
    await session.play();

    const lens = await cameraKit.lensRepository.loadLens(
        '22a6e79d-adee-4d2d-b6e9-0925e6cc3ffa',
        'c15f86ce-6781-4a19-bca1-bd87f4a546a2'


    );
    await session.applyLens(lens);

    let recorder:MediaRecorder;
    let data:Blob[] = [];

    function startRecording() {
        const canvasStream = liveRenderTarget.captureStream(30); // 30 FPS
        recorder = new MediaRecorder(canvasStream);

        recorder.ondataavailable = event => data.push(event.data);
        recorder.onerror = () => {
            console.error('Recorder Error:');
        };
        recorder.onstop = () => {
            console.log('Recording stopped');

            const blob = new Blob(data, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);

            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = 'recorded-video.webm';

            document.body.appendChild(downloadLink);
            downloadLink.click();

            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
        };

        recorder.start();
        console.log('Recording started');
    }
    
    const startButton = document.createElement('button');
    const style = document.createElement('style');
style.textContent = `
  .start-button, .stop-button {
    padding: 10px 20px;
    font-size: 16px;
    margin: 5px;
  }

  @media (max-width: 600px) {
    .start-button, .stop-button {
      font-size: 14px;
      padding: 8px 16px;
    }
  }
`;
document.head.appendChild(style);

startButton.className = 'start-button';

    startButton.className ='start-button'
    startButton.textContent = 'Record';
    document.body.appendChild(startButton);

    startButton.addEventListener('click', () => {
        startRecording();
    });

    const stopButton = document.createElement('button');
    stopButton.textContent = 'Stop';
    document.body.appendChild(stopButton);

    stopButton.addEventListener('click', () => {
        if (recorder && recorder.state === 'recording') {
            recorder.stop();
        }
    });
})();
