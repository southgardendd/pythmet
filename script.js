document.addEventListener('DOMContentLoaded', function() {
    const stageWidth = 450;
    const stageHeight = 450;

    const stage = new Konva.Stage({
        container: 'canvas-container',
        width: stageWidth,
        height: stageHeight,
    });

    // Adjust position of the stage to center it on the screen
    const container = document.getElementById('canvas-container');
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';

    const backgroundLayer = new Konva.Layer();
    const helmetLayer = new Konva.Layer();
    const handlesLayer = new Konva.Layer();
    stage.add(backgroundLayer, helmetLayer, handlesLayer);

    let backgroundImageObj = new Image();
    const backgroundImageInput = document.getElementById('backgroundImageInput');
    backgroundImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            backgroundImageObj.src = e.target.result;
            backgroundImageObj.onload = function() {
                drawBackground();
            };
        };
        reader.readAsDataURL(file);
    });

    let helmetImages = [
        'images/pythmet1.png', 'images/pythmet2.png', 'images/pythmet3.png',
        'images/pythmet4.png', 'images/pythmet5.png', 'images/pythmet6.png',
        'images/pythmet7.png', 'images/pythmet8.png', 'images/pythmet9.png'
    ];
    let currentHelmetIndex = 0;
    let helmetImageObj = new Image();
    helmetImageObj.onload = function() {
        initializeHelmet();
    };
    helmetImageObj.src = helmetImages[currentHelmetIndex];

    let transformer;

    // Function to draw the background image
    function drawBackground() {
        let background = new Konva.Image({
            x: 0,
            y: 0,
            image: backgroundImageObj,
            width: stage.width(),
            height: stage.height(),
        });
        backgroundLayer.removeChildren();
        backgroundLayer.add(background);
        backgroundLayer.batchDraw();
    }

    // Function to initialize helmet image
    function initializeHelmet() {
        let helmet = new Konva.Image({
            x: 140,
            y: 150,
            image: helmetImageObj,
            draggable: true,
        });

        helmet.on('transform', function() {
            updateHelmetDiv();
            handlesLayer.batchDraw();
        });

        helmet.on('dragmove', function() {
            updateHelmetDiv();
            handlesLayer.batchDraw();
        });

        helmet.on('click', function(e) {
            showTransformer();
            e.cancelBubble = true; // Prevent event bubbling to stage
        });

        helmetLayer.removeChildren();
        helmetLayer.add(helmet);

        transformer = new Konva.Transformer({
            nodes: [helmet],
            keepRatio: true,
            rotateEnabled: true,
            enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
            enabledHandlers: ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right', 'middle-top', 'middle-bottom'],
        });
        handlesLayer.removeChildren();
        handlesLayer.add(transformer);

        stage.batchDraw();
    }

    // Update helmet preview
    function updateHelmetPreview() {
        const previewContainer = document.getElementById('helmetPreview');
        previewContainer.innerHTML = '';
        for (let i = currentHelmetIndex; i < currentHelmetIndex + 3; i++) {
            const img = document.createElement('img');
            img.src = helmetImages[i % helmetImages.length];
            img.addEventListener('click', () => {
                helmetImageObj.src = img.src;
            });
            previewContainer.appendChild(img);
        }
    }

    // Event listener for flipping helmet image
    document.getElementById('prevHelmetButton').addEventListener('click', () => {
        currentHelmetIndex = (currentHelmetIndex - 1 + helmetImages.length) % helmetImages.length;
        updateHelmetPreview();
    });

    document.getElementById('nextHelmetButton').addEventListener('click', () => {
        currentHelmetIndex = (currentHelmetIndex + 1) % helmetImages.length;
        updateHelmetPreview();
    });

    // Initial helmet preview update
    updateHelmetPreview();

    // Event listener for saving the image
    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', () => {
        hideTransformer();
        stage.toDataURL({
            callback: function(dataUrl) {
                const link = document.createElement('a');
                link.download = 'pythmeted.jpg';
                link.href = dataUrl;
                link.click();
                showTransformer();
            }
        });
    });

    function updateHelmetDiv() {
        // Implement based on your requirements, adjusting position and size of a div element
    }

    function showTransformer() {
        if (transformer) {
            transformer.show();
            handlesLayer.batchDraw();
        }
    }

    function hideTransformer() {
        if (transformer) {
            transformer.hide();
            handlesLayer.batchDraw();
        }
    }
});
