const DEBUG = true;

const Config = ({ debug = DEBUG }) => {
  return {
    apiBase: "",
    debug: debug
  };
};

module.exports = {
  getConstants: function() {
    return {
      index: "key",
      columns: [
        {
          Header: "Key",
          accessor: "key"
        },
        {
          Header: "Value",
          accessor: "value"
        },
        {
          Header: "Description",
          accessor: "description"
        }
      ],
      data: [
        {
          key: "A",
          value: "Straight",
          description: "Diving Positions"
        },
        {
          key: "B",
          value: "Pike",
          description: "Diving Positions"
        },
        {
          key: "C",
          value: "Tuck",
          description: "Diving Positions"
        },
        {
          key: "D",
          value: "Free",
          description: "Diving Positions"
        }
      ]
    };
  },
  getDifficulties: function () {
    return {
      index: 'code',
      columns: [
        {
          
        }
      ],
      data: [
        
      ]
    };
  }
};
