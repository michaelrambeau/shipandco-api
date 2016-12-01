A convenient tool to beautify/compress

https://gchq.github.io/CyberChef/


## Shipments by carrier

db.shipments.aggregate([{$group:{_id:'$shipment_infos.carrier',count:{$sum:1}}}])
