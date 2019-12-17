export default class Assembly {
    constructor(data) {
        this.zhName = '';
        this.enName = '';
        this.stageType = 0;
        this.heightType = 0;
        this.numOfEJ = 0;
        this.numOfSJ = 0;
        this.dives = 0;
        this.id = 0;
        this.match = { matchId: 0 };
        if (data) this.setData(data);
    }
    setData = ({ ZhName, EnName, StageType, HeightType, NumOfExecJudges, NumOfSyncJudges, Dives, Id, HeightTypeName, StageTypeName} ) => {
        this.zhName = ZhName || '';
        this.enName = EnName || '';
        this.stageType = StageType || 0;
        this.heightType = HeightType || 0;
        this.numOfEJ = NumOfExecJudges || 0;
        this.numOfSJ = NumOfSyncJudges || 0;
        this.dives = Dives || 0;
        this.id = Id || '';
    };
    getWebServiceObject = (data) => {
        let {
            zhName: ZhName, enName: EnName, stageType: StageType, heightType: HeightType,
            numOfEJ: NumOfExecJudges, numOfSJ: NumOfSyncJudges, dives: Dives, id: Id
        } = data;
        return { ZhName: ZhName, EnName, StageType, HeightType, NumOfSyncJudges, NumOfExecJudges, Dives, Id, CreatedBy: 'dummy' };
    }
}