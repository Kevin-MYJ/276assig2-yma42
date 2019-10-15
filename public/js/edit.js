function total(){
    var fl = document.getElementById("newFl").value;
    var fi = document.getElementById("newFi").value;
    var fir = document.getElementById("newFir").value;
    var wa = document.getElementById("newWa").value;
    var el = document.getElementById("newEl").value;
    var fr = document.getElementById("newFr").value;
    var tot = Number(fl) + Number(fi) + Number(fir) + Number(wa) + Number(el) + Number(fr);
    console.log(fl);
    console.log(tot);
    if(fl!=''||fi!=''||fir!=''||wa!=''||el!=''||fr!='')
    {
        document.getElementById("total").innerHTML = tot;
    }else{
        document.getElementById("total").innerHTML = '';
    }
}