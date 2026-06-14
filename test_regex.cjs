const t = '##Ringkasan Materi Ajar###Tujuan Pembelajaran';
console.log(t.replace(/(#{1,6})\s*/g, '\n\n$1 '));
