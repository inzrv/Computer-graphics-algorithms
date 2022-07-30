limit_val.innerHTML = lim_sldr.value;

function load_picture() //загружаем картинку
{
	const ctx = origial_canvas.getContext("2d");
	const img = new Image();
	img.src = './img/zebra.png'; // <- ссылка на избражение 300 х 300
	img.onload = () => ctx.drawImage(img, 0, 0);
}


const haar_sum = [];
const haar_dif = [];

function compute_sum_dif() //заполняtv массив полусумм и полуразностей
{
	haar_sum.length = haar_dif.length = 0;
	const orig_data = origial_canvas.getContext("2d").getImageData(0,0,origial_canvas.height,origial_canvas.width).data;
	for(let j = 0; j < orig_data.length; j+=8)
	{
		for (let i = 0; i < 4; i++)
		{
			haar_sum.push((orig_data[j+i] + orig_data[j+i+4])/2);
			haar_dif.push((orig_data[j+i] - orig_data[j+i+4])/2);
		}
	}
}


function cut_arr(arr, delta)	// зануление элементов массива полуразностей, меншьших delta
{
	return arr
			.map(
				(item) => {
					if(Math.abs(item) < delta)
						return item = 0;
					return item;
				}
			);
}


function invert_transparency(arr)
{
	const inverted_transp = arr.slice();
	for(let i = 3; i < 150*300*4; i+=4)
		inverted_transp[i] = 255 - inverted_transp[i];
	return inverted_transp;
}


function compress(haar_dif_inv_transp)
{
	const val = Number(lim_sldr.value);
	const cut_dif = cut_arr(haar_dif, val);
	const cut_dif_inv = invert_transparency(cut_dif);
	const haar_ctx = haar_canvas.getContext("2d");
	let haarDifImageData = new ImageData(new Uint8ClampedArray(cut_dif_inv),150,300);
	haar_ctx.putImageData(haarDifImageData,150,0);					
	const result_ctx = result_canvas.getContext("2d");
	const result = [];
	for(let i = 0; i < 150*300*4; i+=4)
	{
		for(let j = 0; j < 4; j++)
			result.push(haar_sum[i+j]+cut_dif[i+j]);
		for(let j = 0; j < 4; j++)
			result.push(haar_sum[i+j]-cut_dif[i+j]);
	}
	let resultImageData = new ImageData(new Uint8ClampedArray(result),300,300);
	result_ctx.putImageData(resultImageData,0,0);
} 


function initialize()
{
	load_picture();
	setTimeout(
				() =>	{
							compute_sum_dif();
							compress();
							const haar_ctx = haar_canvas.getContext("2d");
							let haarSumImageData = new ImageData(new Uint8ClampedArray(haar_sum),150,300);
							haar_ctx.putImageData(haarSumImageData,0,0);
						},
						4
			);
	
	
}

lim_sldr.oninput = function() {
    limit_val.innerHTML = this.value;
	compress();
}
