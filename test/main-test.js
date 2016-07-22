'use strict';

describe("formatTags",function() {
  it("should split tags to two parts",function() {
    let result = formatTags(["ITEM000001", "ITEM000003-2.5"]);
    expect(result).toEqual([{barcode:"ITEM000001",amount:1},{barcode:"ITEM000003",amount:2.5}]);
  })
});

describe("mergeBarcodes",function () {
  it("should delete repeated barcodes",function () {
    let barcodes = [{barcode:"ITEM000001",amount:1},{barcode:"ITEM000001",amount:1},
                    {barcode:"ITEM000005",amount:2},{barcode:"ITEM000005",amount:1}];
    let result = mergeBarcodes(barcodes);
    expect(result).toEqual([{barcode:"ITEM000001",amount:2},{barcode:"ITEM000005",amount:3}]);
  })
});

describe("matchAllBarcodes",function () {
  it("should show details of everygood",function () {
    let mergedBarcodes = [{barcode:"ITEM000001",amount:5},{barcode:"ITEM000005",amount:3}];
    let allItems = loadAllItems();
    let result = matchAllBarcodes(mergedBarcodes,allItems);
    expect(result).toEqual([{"barcode":"ITEM000001","name":"雪碧","unit":"瓶","price":3,"amount":5},
                        {"barcode":"ITEM000005","name":"方便面","unit":"袋","price":4.5,"amount":3}]);
  })
});

describe("countOriginSubtotal",function () {
  it("should count originSubtotal of everygood",function () {
    let sumList = [{"barcode":"ITEM000001","name":"雪碧","unit":"瓶","price":3,"amount":5},
      {"barcode":"ITEM000005","name":"方便面","unit":"袋","price":4.5,"amount":3}];
    let result = countOriginSubtotal(sumList);
    expect(result).toEqual([{"barcode":"ITEM000001","name":"雪碧","unit":"瓶","price":3,"amount":5,"originSubtotal":15},
                     {"barcode":"ITEM000005","name":"方便面","unit":"袋","price":4.5,"amount":3,"originSubtotal":13.5}]);
  })
});

describe("countSaving",function () {
  it("should count saving of everygood",function () {
    let originSubtotalList = [{"barcode":"ITEM000001","name":"雪碧","unit":"瓶","price":3,"amount":5,"originSubtotal":15},
                       {"barcode":"ITEM000005","name":"方便面","unit":"袋","price":4.5,"amount":3,"originSubtotal":13.5}];
    let allPromotions = loadPromotions();
    let result = countSaving(originSubtotalList,allPromotions);
    expect(result).toEqual([{"barcode":"ITEM000001","name":"雪碧","unit":"瓶","price":3,"amount":5,"originSubtotal":15,"saving":3},
                {"barcode":"ITEM000005","name":"方便面","unit":"袋","price":4.5,"amount":3,"originSubtotal":13.5,"saving":4.5}]);
  })
});

describe("countSubtotal",function () {
  it("should count newSubtotal of everygood",function () {
    let savingList = [{"barcode":"ITEM000001","name":"雪碧","unit":"瓶","price":3,"amount":5,"originSubtotal":15,"saving":3},
      {"barcode":"ITEM000005","name":"方便面","unit":"袋","price":4.5,"amount":3,"originSubtotal":13.5,"saving":4.5}];
    let result = countSubtotal(savingList);
    expect(result).toEqual([{"barcode":"ITEM000001","name":"雪碧","unit":"瓶","price":3,"amount":5,"originSubtotal":15,"saving":3,"subtotal":12},
                {"barcode":"ITEM000005","name":"方便面","unit":"袋","price":4.5,"amount":3,"originSubtotal":13.5,"saving":4.5,"subtotal":9}]);
  })
});

describe("countTotal",function () {
  it("should count all newSubtotal to total",function () {
    let subtotalList = [{"barcode":"ITEM000001","name":"雪碧","unit":"瓶","price":3,"amount":5,"originSubtotal":15,"saving":3,"subtotal":12},
      {"barcode":"ITEM000005","name":"方便面","unit":"袋","price":4.5,"amount":3,"originSubtotal":13.5,"saving":4.5,"subtotal":9}];
    let result = countTotal(subtotalList);
    expect(result).toBe(21);
  })
});

describe("countSavingTotal",function () {
  it("should count all saving to savingTotal",function () {
    let savingList = [{"barcode":"ITEM000001","name":"雪碧","unit":"瓶","price":3,"amount":5,"originSubtotal":15,"saving":3},
      {"barcode":"ITEM000005","name":"方便面","unit":"袋","price":4.5,"amount":3,"originSubtotal":13.5,"saving":4.5}];
    let result = countSavingTotal(savingList);
    expect(result).toBe(7.5)
  })
});

/*describe('pos', () => {

  it('should print text', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];

    spyOn(console, 'log');

    printReceipt(tags);

    const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
  });
});*/
