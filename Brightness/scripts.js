setSlider.bind(brightness_sldr)();
setSlider.bind(contrast_sldr)();

brightness_sldr.oninput = sliderProcess.bind(brightness_sldr);
contrast_sldr.oninput = sliderProcess.bind(contrast_sldr);

function load_picture()
{
	const ctx = original_canvas.getContext("2d");
	const img = new Image();
	img.src = './img/flower.png';
	img.onload = () => ctx.drawImage(img, 0, 0);
}


function initialize()
{
	load_picture();
	setTimeout(
		() => 
			{
				Process();
				histBrightness = grayScale();
				fillHist(histBrightness);
			},
		4
	);
}



function Process()
{
	const brightnessVal = Number(brightness_sldr.value);
	const contrastVal = Number(contrast_sldr.value);
	const orig_data = original_canvas.getContext("2d").getImageData(0,0,original_canvas.height,original_canvas.width).data;
	
	const result = [];
	for(let i = 0; i < orig_data.length; i++)
	{
		if(i%4 == 3)
			result.push(orig_data[i]);
		else 
			result.push(contrast_change(orig_data[i], contrastVal) + brightnessVal);
	}

	const ctx = result_canvas.getContext("2d");
	const procImageData = new ImageData(new Uint8ClampedArray(result),300,300);
	ctx.putImageData(procImageData,0,0);
	
	histBrightness = grayScale();
	fillHist(histBrightness);
}

function contrast_change(item, val) {
	const contrast = val / 255 + 1;
	const intercept = 128 * (1 - contrast);
	return item*contrast + intercept;
}


function setSlider()
{
	this.nextElementSibling.lastChild.innerHTML = this.value;
}

function sliderProcess()
{
	setSlider.bind(this)();
	Process();
}

function grayScale()
{
	const histBrightness = (new Array(256)).fill(0);
	const gray_data = result_canvas.getContext("2d").getImageData(0,0,original_canvas.height,original_canvas.width).data.slice();
	for (let i = 0; i < gray_data.length; i+=4) {
		const avg = (gray_data[i] + gray_data[i+1] + gray_data[i+2])/3;
		gray_data[i]	= avg;
		gray_data[i+1] 	= avg;
		gray_data[i+2] 	= avg;
		histBrightness[avg]++;
	}
	const ctx = gray_canvas.getContext("2d");
	const procImageData = new ImageData(gray_data,300,300);
	ctx.putImageData(procImageData,0,0);
	return histBrightness;
}


function fillHist(histBrightness)
{
	const ctx = h_canvas.getContext('2d');
	const dx = h_canvas.width / 256;
	const dy = h_canvas.height / Math.max(...histBrightness);
	ctx.lineWidth = dx;
	ctx.clearRect(0, 0, h_canvas.width, h_canvas.height);

	for (let i = 0; i < 256; i++) {
		const x = i * dx;
		ctx.beginPath();
		ctx.moveTo(x, h_canvas.height);
		ctx.lineTo(x, h_canvas.height - histBrightness[i] * dy);
		ctx.closePath();
		ctx.stroke(); 
	}
}