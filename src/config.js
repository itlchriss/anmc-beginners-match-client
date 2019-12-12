const DEBUG = true;

const ComponentIndexConfiguration = {
  MatchSettingConfiguration: {
    MatchListIndex: 1,
    MatchConfigurationIndex: 2
  }
};

const SystemConfiguration = ({ debug = DEBUG }) => {
  return {
    apiBase: "",
    debug: debug
  };
};

export { ComponentIndexConfiguration, SystemConfiguration };
