import React from 'react';
import MaterialTable from 'material-table';

const Report = props => (
  <MaterialTable
    actions={[
      {
        icon: () => (
          <div className="import-action-wrapper ripple">
            <i className="material-icons">save_alt</i>
            <input
              name="timeReport"
              type="file"
              onChange={props.handleFileChange}
            />
          </div>
        ),
        tooltip: 'Upload CSV',
        isFreeAction: true,
        onClick: () => {
          return null;
        }
      }
    ]}
    columns={[
      { title: 'Employee ID', field: 'employeeId', type: 'numeric' },
      { title: 'Pay Period', field: 'payPeriod' },
      { title: 'Amount Paid', field: 'amountPaid', type: 'currency' }
    ]}
    data={props.data}
    options={{ pageSize: 8, search: false }}
    title="Payroll Report"
  />
);

export default Report;
