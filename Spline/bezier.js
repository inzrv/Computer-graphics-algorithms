CanvasRenderingContext2D.prototype.bezier = bezier;

function fact(k){
    if(k==0 || k==1){
        return 1;
    }
    else{
        return k * fact(k-1);
    }
}

function B(i,n,t){
    return fact(n) / (fact(i) * fact(n-i))* Math.pow(t, i) * Math.pow(1-t, n-i);
}

function distance(a, b){
    return Math.sqrt(Math.pow(a[0]-b[0], 2) + Math.pow(a[1]-b[1], 2));
}

function P(t, points){
    var r = [0,0];
    var n = points.length-1;
    for(var i=0; i <= n; i++){
        r[0] += points[i][0] * B(i, n, t);
        r[1] += points[i][1] * B(i, n, t);
    }
    return r;
}

function computeSupportPoints(points){
    var tLength = 0;
    for(var i=0; i< points.length-1; i++){
        tLength += distance(points[i], points[i+1]);
    }
    var step = 1 / tLength;

    var temp = [];
    for(var t=0;t<=1; t=t+step){
        var p = P(t, points);
        temp.push(p);
    }
    return temp;
}

function paintPoint(ctx, color,  point){
  ctx.save();
  switch(color){
    case 'blue':
      ctx.strokeStyle = "rgb(0, 0,200)";
      ctx.strokeRect(point[0]- 3 , point[1] - 3, 6, 6);
      break;

    case 'black':
      ctx.strokeStyle = "rgb(0, 0,0)";
      ctx.strokeRect(point[0]- 1 , point[1] - 1, 2, 2);
      break;
    }
    ctx.restore();
}

function paintCurve(ctx, points){
    ctx.save();

    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for(var i=1;i<points.length; i++){
        ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.stroke();
    ctx.restore();
}

function paintPoints(ctx, points, color){
    ctx.save();
    ctx.strokeStyle = '#CCCCCC';
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for(var i=1;i<points.length; i++){
        ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.stroke();
    for(var i=0;i<points.length; i++){
        paintPoint(ctx, color, points[i]);
        ctx.fillText("P" + i + " [" + points[i][0] + ',' + points[i][1] + ']', points[i][0], points[i][1] - 10);
    }
    ctx.restore();
}

function bezier(initialPoints){
    var supportPoints = computeSupportPoints(initialPoints);
    paintCurve(this, supportPoints);
    paintPoints(this, initialPoints, "blue");
}
