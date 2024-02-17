// import Uppy from '@uppy/core';
// import Tus from '@uppy/tus';
// import Dashboard from '@uppy/dashboard';

// const uppy = new Uppy({
//   debug: true,
//   autoProceed: false,
//   restrictions: {
//     maxFileSize: null, // Set according to your needs or leave null for no limit
//     maxNumberOfFiles: 1, // Adjust based on your requirements
//     minNumberOfFiles: 1,
//     allowedFileTypes: ['video/*'], // Only allow video files
//   },
// })

// uppy.use(Dashboard, {
//   target: '#uppyDashboard',
//   inline: true,
//   proudlyDisplayPoweredByUppy: false,
// })

// uppy.use(Tus, {
//   endpoint: '', // Specify your Tus server endpoint here
//   chunkSize: 5 * 1024 * 1024, // 5MB chunk size, adjust based on your needs
//   retryDelays: [0, 1000, 3000, 5000], // Retry delays in milliseconds
// })

// uppy.on('complete', (result) => {
//   console.log('Upload complete! Results:', result);
// });
