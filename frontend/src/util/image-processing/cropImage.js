const cropImage = (sourceImage) => {
    const WIDTH_RATIO = 1.91;
    const HEIGHT_RATIO = 1.25;
    return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const image = new Image();
        
        image.src = sourceImage
        image.crossOrigin = "anonymous"
        image.onload = function () {
            try {
                const options = {}
                if (this.width / this.height > WIDTH_RATIO) {
                    const pixelsToRemove = (this.width - this.height * WIDTH_RATIO)
                    options.sx = pixelsToRemove/2;
                    options.sy = 0;
                    options.sw = this.width - pixelsToRemove/2
                    options.sh = this.height
                    options.dw = this.width - pixelsToRemove/2
                    options.dh = this.height

                    canvas.width = this.width - pixelsToRemove;
                    canvas.height = this.height;
                } else if (this.height / this.width > HEIGHT_RATIO) {
                    const pixelsToRemove = (this.height - this.width * HEIGHT_RATIO)
                    options.sx = 0;
                    options.sy = pixelsToRemove/2;
                    options.sw = this.width
                    options.sh = this.height - pixelsToRemove/2
                    options.dw = this.width
                    options.dh = this.height - pixelsToRemove/2

                    canvas.height = this.height - pixelsToRemove;
                    canvas.width = this.width;
                } else {
                    resolve(sourceImage)
                }

                ctx.drawImage(
                    image,
                    options.sx,
                    options.sy, 
                    options.sw,
                    options.sh, 
                    0,
                    0, 
                    options.dw,
                    options.dh
                ); 
                resolve(canvas.toDataURL())
            } catch(error) {
                reject(error)
            }

        };
    })
}

export default cropImage