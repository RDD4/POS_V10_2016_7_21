'use strict';

var tags = [
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000003-2.5',
  'ITEM000005',
  'ITEM000005-2',
];
//不去重
function formatTags(tags) {
  var barcodes = [];
  for (var i = 0; i < tags.length; i++) {
    var temp = tags[i].split('-');
    if (temp.length === 2) {
      barcodes.push(Object.assign({}, {barcode: temp[0]}, {amount: Number(temp[1])}));
    } else {
      barcodes.push((Object.assign({}, {barcode: temp[0]}, {amount: 1})));
    }
  }
  return barcodes;
}
/* console.log(JSON.stringify(formatTags(tags)));
 var a1 = formatTags(tags);*/

//去重
function mergeBarcodes(barcodes) {
  var mergedBarcodes = [];
  for (var i = 0; i < barcodes.length; i++) {
    var existList = mergedBarcodes.find(function (item) {
      return item.barcode === barcodes[i].barcode;
    })
    if (existList) {
      existList.amount += barcodes[i].amount;
    } else {
      mergedBarcodes.push(Object.assign({}, {barcode: barcodes[i].barcode}, {amount: barcodes[i].amount}));
    }
  }
  return mergedBarcodes;
}
/*console.log(JSON.stringify(mergeBarcodes(a1)));
var a2 = mergeBarcodes(a1);*/

//展示所有商品信息
var allItems = loadAllItems();//定义一个变量接受loadAllItems函数返回值

//编号匹配商品
function matchAllBarcodes(mergedBarcodes, allItems) {
  var sumList = [];
  for (var i = 0; i < allItems.length; i++) {
    var existList = mergedBarcodes.find(function (item) {
      return item.barcode === allItems[i].barcode;
    });
    if (existList) {
      sumList.push(Object.assign({}, allItems[i], {amount: existList.amount}));
    }
  }
  return sumList;
}
/*console.log(JSON.stringify(matchAllBarcodes(a2, allItems)));
var a3 = matchAllBarcodes(a2, allItems);*/

//展示优惠信息
var allPromotions = loadPromotions();

//计算原始小计
function countOriginSubtotal(sumList) {
  var originSubtotalList = [];
  for (var i = 0; i < sumList.length; i++) {
    var originSubtotal = (sumList[i].price) * (sumList[i].amount);
    originSubtotalList.push(Object.assign({}, sumList[i], {originSubtotal: originSubtotal}));
  }
  return originSubtotalList;
}
/*console.log(JSON.stringify(countOriginSubtotal(a3)));
var a4 = countOriginSubtotal(a3);*/

//计算每件商品的优惠
function countSaving(originSubtotalList, allPromotions) {
  var savingList = [];
  var proBarcodes = allPromotions[0].barcodes;
  for(var i=0;i<originSubtotalList.length;i++){
    var existList = proBarcodes.find(function (item) {
      return item === originSubtotalList[i].barcode;
    });
    if(existList){
      var saving = Math.floor(originSubtotalList[i].amount/3)*(originSubtotalList[i].price);
      savingList.push(Object.assign({},originSubtotalList[i],{saving:saving}));
    }else{
      savingList.push(Object.assign({},originSubtotalList[i],{saving:0}));
    }
  }
  return savingList;
}
/*console.log(JSON.stringify(countSaving(a4, allPromotions)));
var a5 = countSaving(a4, allPromotions);*/

//计算优惠后的小计
function countSubtotal(savingList) {
  var subtotalList = [];
  for (var i = 0; i < savingList.length; i++) {
    var subtotal = savingList[i].originSubtotal - savingList[i].saving;
    subtotalList.push(Object.assign({}, savingList[i], {subtotal: subtotal}));
  }
  return subtotalList;
}
/*console.log(JSON.stringify(countSubtotal(a5)));
var a6 = countSubtotal(a5);*/

//计算总计
function countTotal(subtotalList) {
  var total = 0;
  for (var i = 0; i < subtotalList.length; i++) {
    total += subtotalList[i].subtotal;
  }
  return total;
}
/*console.log(JSON.stringify(countTotal(a6)));
var a7 = countTotal(a6);*/

//计算总节省
function countSavingTotal(savingList) {
  var savingTotal = 0;
  for (var i = 0; i < savingList.length; i++) {
    savingTotal += savingList[i].saving;
  }
  return savingTotal;
}
/*console.log(JSON.stringify(countSavingTotal(a5)));
var a8 = countSavingTotal(a5);*/

//输出
function print(subtotalList, total, savingTotal) {
  for (var i = 0; i < subtotalList.length; i++) {
    //console.log(subtotalList[i]);
    console.log("名称: " + subtotalList[i].name + ","
      + " 数量: " + subtotalList[i].amount + subtotalList[i].unit + ","
      + " 单价: " + (subtotalList[i].price).toFixed(2) + "(元)" + ","
      + " 小计: " + (subtotalList[i].subtotal).toFixed(2) + "(元)");
  }
  console.log("总计: " + total.toFixed(2) + "(元)");
  console.log("节省: " + savingTotal.toFixed(2) + "(元)");
}

//主调
function printReceipt(tags) {
  var barcodes = formatTags(tags);
  var mergedBarcodes = mergeBarcodes(barcodes);
  var sumList = matchAllBarcodes(mergedBarcodes, allItems);
  var originSubtotalList = countOriginSubtotal(sumList);
  var savingList = countSaving(originSubtotalList, allPromotions);
  var subtotalList = countSubtotal(savingList);
  var total = countTotal(subtotalList);
  var savingTotal = countSavingTotal(savingList);
  print(subtotalList, total, savingTotal);
}
console.log(printReceipt(tags));
