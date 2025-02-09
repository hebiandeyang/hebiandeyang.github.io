document.getElementById('downloadBtn').addEventListener('click', function() {
    var link = document.createElement('a');
    link.href = 'toyokawaRa.mcaddon';
    link.download = 'Toyokawa Add-on V1.2.2 By CNYoung514 & Hebiandeyang Studio.mcaddon';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(function(){
        alert("如果下载未自动开始，请检查您的下载设置或手动点击上面的链接。");
    }, 1000); // 延迟1秒显示提示，以便给予时间让下载开始
});