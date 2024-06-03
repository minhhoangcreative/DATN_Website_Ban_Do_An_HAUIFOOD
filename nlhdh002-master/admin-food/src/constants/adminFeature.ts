function getList(labelList: string[], navList: string[]) {
  const list = labelList.map((item, index) => ({
    label: item,
    nav: "/admin" + navList[index],
  }))
  return list
}
export const OrderList = getList(
  ["Thống kê top sản phẩm", "Doanh Thu Nhà Cung Cấp", "Nhân viên", "Khách hàng"],
  ["/quote", "/order", "/employee", "/customer"],
)
export const InvoiceList = getList(
  ["Đơn hàng", "Thống kê hóa đơn"],
  ["/invoice", "/invoice-stat"],
)
export const ProductList = getList(
  ["Sản phẩm", "Loại sản phẩm", "Nhà cung cấp"],
  ["/product", "/type", "/supplier"],
)
export const ConfigList = getList(
  ["Cài đặt","Món kèm","Ưu đãi"],
  ["/setting","/expand-food","/voucher"],
)