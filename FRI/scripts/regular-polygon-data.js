function regularPolygon(n, r) {
    let data = [];
    let alpha = Math.PI * 2 / n;
    for(let i=0; i<n; i++){
        let x = Math.cos(alpha * i) * r;
        let y = Math.sin(alpha * i) * r;
        let z = 0.0;
        data.push(x, y, z);
    }
    return data;
}