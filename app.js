
/************************* variables ******************************/

const video = document.getElementById('video')
var detectedFaces = [];
var facesInfos = [];
var selectCanvas;



/************************* Loading the models for faceapi ******************************/

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')


    // After loading the models call the start video function
]).then(startVideo)
// console.log("done promise.all")

/************************* Start video after loading the models  ******************************/

async function startVideo() {
    // document.body.append("Models loaded");
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
    // console.log("video added")
    recognizeFaces();

}

async function recognizeFaces() {

    const labeledFaceDescriptors = await loadLabeledImages()
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5)

    /************************* Event listener when the video is playing  ******************************/
    video.addEventListener('play', async () => {
        console.log("playing")
        selectCanvas.style("z-index", "3")


        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()
            detectedFaces = detections;
            const results = detectedFaces.map((d) => {
                return faceMatcher.findBestMatch(d.descriptor)
            })
            facesInfos = results;
        }, 100)
    })
}


/************************* Loading images from the Folder to recognize the faces   ******************************/

async function loadLabeledImages() {
    const labels = ['Mohammed', 'Osamah', 'Abdurahman', 'Dr. Hakan GENÇOĞLU']
    return Promise.all(
        labels.map(async label => {
            const descriptions = []
            for (let i = 1; i <= 4; i++) {
                const img = await faceapi.fetchImage(`/labeled_images/${label}/${i}.jpg`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                console.log(label + i + JSON.stringify(detections))
                descriptions.push(detections.descriptor)
            }
            // document.body.append(label + "faces Loaded")
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}

/************************* make boxes around the detected faces   ******************************/

function makeBoxes() {
    // console.log(detections)
    if (detectedFaces.length > 0) {

        for (let i = 0; i < detectedFaces.length; i++) {
            let x = detectedFaces[i].alignedRect._box._x;
            let y = detectedFaces[i].alignedRect._box._y;

            let rectWidth = detectedFaces[i].alignedRect._box._width;
            let rectHeight = detectedFaces[i].alignedRect._box._height;

            stroke(255, 255, 0);
            strokeWeight(5);
            noFill();
            rect(x + (x / 8), y, rectWidth + (rectWidth / 5), rectHeight + (rectHeight / 5));
            noStroke();
            strokeWeight(3)
            stroke(0)
            fill('white')
            textSize(20)
            text(facesInfos[i]._label, x, y)
            noFill()
            console.log(facesInfos);
        }

    }
}