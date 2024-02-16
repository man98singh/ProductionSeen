import { bootstrapCameraKit } from '@snap/camera-kit';

(async function () {
    const cameraKit = await bootstrapCameraKit({ apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzA1MTUxMzg0LCJzdWIiOiI3NDRiZTczYS1iODlmLTRkYzAtYjk1MC0yMDIyNGY2NjJjMGF-U1RBR0lOR35iZGM2ZTgyOS1iYTdhLTRmNDgtOGVlMC0wZWMyYjFlMjE1ZTYifQ.6HxXxLjUNOD9IV73x8tFcF11P4jDYGeD--7kW02iGho' });
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
        'd09b6c45-f373-43c4-bd80-dd0e9080f16f',
        '8c3ff034-5a0c-498c-85d8-3b1c30eae0cd'
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
