'use strict';
const fs = require('fs');//requireはライブラリの読み込み、読み込むと使えるfsファイルシステムモジュール（ファイル読み込み、書き出しに使う）
const readline = require('readline');//ファイルをどう読むかのモジュール。これは1行づつ読む。
const rs = fs.createReadStream('./popu-pref.csv');//ストリーム（流れ）にしてから指定ファイルを読む。
const rl = readline.createInterface({'input': rs, 'output': {}});//イベントを監視する。rsを使って呼んでください。これは1行読めた時。（改行にたどり着いたら）
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line',(lineString) => {//lineString1行入ってます。
  const columns = lineString.split(',');//spｨtでわける。今回はカンマ区切りの配列にしたい。
  const year = parseInt(columns[0]);//添字の0番目が年
  const prefecture = columns[1];//添字の1番目が都道府県
  const popu = parseInt(columns[3]);//添字の3番目が人口
  if (year === 2010 || year === 2015) {//yearに2010か2015が入ってない行は無視
    let value = prefectureDataMap.get(prefecture);//prefectureDataMapをつくっていく。都道府県を取ってくる。
    if (!value) {//無かったら新しいの作る
    　value = {
        popu10: 0,//2010年の人口
        popu15: 0,//2015年の人口
        change: null//変化率
        };
        }
        if (year === 2010) {//2010年だったら
            value.popu10 = popu;//2010年の人口をいれる
        }
        if (year === 2015) {//2015年だったら
            value.popu15 = popu;//2015年の人口をいれる
        }
        prefectureDataMap.set(prefecture, value);//
    }
});
rl.on('close', () => {//rlのイベントで終了したら
    for (let [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => { return  pair1[1].change -pair2[1].change ; 
    });
 const rankingStrings = rankingArray.map(([key, value],i) => {
    return (i+1)+`${key}:${value.popu10} -> ${value.popu15}　変化率： ${value.change}`;  
 });

    console.log(rankingStrings);  //コンソールに上を表示
})