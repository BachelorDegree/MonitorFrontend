//let time = Math.floor(Date.now() / 1000 / 60) * 60;
let time = 1591445880
console.log(time)
let ret = []
let sql = "INSERT INTO `service_index_logs` (`id`, `service_index_id`, `machine_id`, `value`, `time`, `createdAt`, `updatedAt`) VALUES "
let i = 0;
for (let i = time; i <= time + 3600; i += 60) {
  let a = Math.random() * 3
  ret.push(`(NULL, '3', '1', '${a}', '${i}', '2020-06-13 00:00:00', '2020-06-06 00:00:00') `)
  a = Math.random() * 2 + 1
  ret.push(`(NULL, '3', '2', '${a}', '${i}', '2020-06-13 00:00:00', '2020-06-06 00:00:00') `)
  a = Math.random() * 2 + 1
  ret.push(`(NULL, '3', '3', '${a}', '${i}', '2020-06-13 00:00:00', '2020-06-06 00:00:00') `)
}
console.log(sql + ret.join(','))