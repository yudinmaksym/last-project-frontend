export default function() {
  return [
    {
      items: [
        {
          title: 'Home',
          to: '/',
          htmlBefore: '<i class="material-icons">home</i>',
          htmlAfter: '',
        },
      ],
    },
    {
      items: [
        {
          title: 'CD Tool',
          to: '/cd',
          htmlBefore: '<i class="fas fa-funnel-dollar"></i>',
          htmlAfter: '',
        },
      ],
    },
    {
      items: [
        {
          title: 'ED Tool',
          to: '/ed',
          htmlBefore: '<i class="fas fa-funnel-dollar"></i>',
          htmlAfter: '',
          rules: {
            roles: [ 'Admin', 'User'],
          },
        },
      ],
    },
    {
      items: [
        {
          title: 'WTA',
          to: '/wta',
          htmlBefore: '<i class="fas fa-funnel-dollar"></i>',
          htmlAfter: '',
          rules: {
            roles: [ 'Admin', 'User'],
          },
        },
      ],
    },
    {
      title: 'Dashboard',
      id: 'dashboard',
      dropdown: true,
      open: true,
      htmlBefore: '<i class="material-icons">insert_chart_outlined</i>',
      items: [
        {
          title: 'Portfolio Dashboard',
          to: '/dashboard',
          htmlBefore: '<i class="material-icons">folder</i>',
          htmlAfter: '',
        },
        {
          title: 'Zone Dashboard',
          to: '/zones/dashboard',
          htmlBefore: '<i class="material-icons">location_on</i>',
          htmlAfter: '',
        },
        {
          title: 'Project Dashboard',
          to: '/projects/dashboard',
          htmlBefore: '<i class="material-icons">bookmark</i>',
          htmlAfter: '',
        },
        {
          title: 'Energy Monitoring',
          to: '/portfolio/performance',
          htmlBefore: '<i class="material-icons">today</i>',
          htmlAfter: '',
          rules: {
            companies: [ 1 ],
          },
        },
      ],
    },
    {
      title: 'Projects',
      items: [
        {
          title: 'Create New',
          to: '/projects/create',
          htmlBefore: '<i class="material-icons">add_to_photos</i>',
          htmlAfter: '',
        },
        {
          title: 'List',
          to: '/projects/list',
          htmlBefore: '<i class="material-icons">list_alt</i>',
          htmlAfter: '',
        },
        {
          title: 'Benchmarking',
          to: '/projects/benchmarking',
          htmlBefore: '<i class="material-icons">list_alt</i>',
          htmlAfter: '',
        },
      ],
    },
    // {
    //   title: 'Zones',
    //   items: [

    //     // {
    //     //   title: 'List',
    //     //   to: '/zones/list',
    //     //   htmlBefore: '<i class="material-icons">location_on</i>',
    //     //   htmlAfter: '',
    //     // },
    //   ],
    // },
    {
      title: 'Invoices',
      items: [
        {
          title: 'Data Input',
          to: '/files/upload',
          htmlBefore: '<i class="material-icons">cloud_upload</i>',
          htmlAfter: '',
        },
        {
          title: 'Consumptions Data',
          to: '/files/tables',
          htmlBefore: '<i class="material-icons">table_chart</i>',
          htmlAfter: '',
        },
        {
          title: 'Browse Uploaded Files',
          to: '/files/list',
          htmlBefore: '<i class="material-icons">attach_file</i>',
          htmlAfter: '',
        },

      ],
    },
    {
      title: 'Meters',
      items: [
        {
          title: 'Table',
          to: '/projects/meters',
          htmlBefore: '<i class="material-icons">add_to_photos</i>',
          htmlAfter: '',
        },
        // {
        //   title: 'Baseline',
        //   to: '/baseline',
        //   htmlBefore: '<i class="material-icons">linear_scale</i>',
        //   htmlAfter: '',
        // },
      ],
    },
    {
      title: 'Apps',
      items: [
        {
          title: 'Degree Day Calculator',
          to: '/apps/degree-calculator',
          // htmlBefore: '<i class="material-icons">date_range</i>',
          htmlAfter: '',
          rules: {
            companies: [ 1 ],
          },
        },
      ],
    },
    // {
    //   title: 'Others',
    //   items: [
    //     {
    //       title: 'Calendar',
    //       to: '/calendar',
    //       htmlBefore: '<i class="material-icons">date_range</i>',
    //       htmlAfter: '',
    //     },
    //     {
    //       title: 'Help Center',
    //       to: '/help',
    //       htmlBefore: '<i class="material-icons">help_outline</i>',
    //       htmlAfter: '',
    //     },
    //   ],
    // },
    {
      title: 'Settings',
      items: [
        // hidden according the task of moving this section
        // into the user profile
        // {
        //   title: 'Manage Users',
        //   to: '/users',
        //   htmlBefore: '<i class="material-icons">settings</i>',
        //   htmlAfter: '',
        // },
        {
          title: 'Reports',
          to: '/reporting',
          htmlBefore: '<i class="material-icons">folder</i>',
          htmlAfter: '',
        },
      ],
    },
  ]
}
