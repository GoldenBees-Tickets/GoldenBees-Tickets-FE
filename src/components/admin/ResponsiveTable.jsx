import { Table } from 'antd';
import PropTypes from 'prop-types';

/**
 * Component bọc Table của Antd để cải thiện responsive.
 * Component này đảm bảo rằng bảng sẽ có scroll ngang bên trong bảng 
 * thay vì scroll toàn màn hình.
 */
const ResponsiveTable = ({ 
  columns, 
  dataSource, 
  rowKey = 'id',
  pagination = false,
  loading = false,
  size = 'middle',
  scroll = { x: true },
  bordered = false,
  onChange,
  locale,
  ...restProps 
}) => {
  return (
    <div className="overflow-x-auto w-full">
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={rowKey}
        pagination={pagination}
        loading={loading}
        size={size}
        bordered={bordered}
        onChange={onChange}
        scroll={scroll}
        locale={locale || {
          emptyText: 'Không có dữ liệu',
          filterConfirm: 'OK',
          filterReset: 'Reset',
        }}
        className="responsive-table"
        {...restProps}
      />
    </div>
  );
};

ResponsiveTable.propTypes = {
  columns: PropTypes.array.isRequired,
  dataSource: PropTypes.array,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  loading: PropTypes.bool,
  size: PropTypes.string,
  scroll: PropTypes.object,
  bordered: PropTypes.bool,
  onChange: PropTypes.func,
  locale: PropTypes.object,
};

export default ResponsiveTable; 