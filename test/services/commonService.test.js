const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

const CommonService = require("../../services/commonService")

describe("test common services", () => {
    // task 1
    it("should success on attempt 3", async () => {
        const commonService = new CommonService()
        const result = await commonService.retryFailures(commonService.createTargetFunction(3), 5)
        expect(result).to.equal(3)
    })

    it("should fails on attempt number 2 and throws last error", async () => {
        const commonService = new CommonService()
        const result = commonService.retryFailures(commonService.createTargetFunction(3), 2)
        await expect(result).to.be.rejectedWith(Error)
    })

    it("should succeeds", async () => {
        const commonService = new CommonService()
        const result = await commonService.retryFailures(commonService.createTargetFunction(10), 10)
        expect(result).to.equal(10)
    })

    it('should apply default arguments for the function', async () => {
        const commonService = new CommonService()

        function add(a, b) {
            return a + b;
        }

        const add2 = commonService.defaultArguments(add, { b: 9 });
        expect(add2(10)).to.equal(19);
        expect(add2(10, 7)).to.equal(17);
        expect(isNaN(add2())).to.be.true;

        const add3 =  commonService.defaultArguments(add2, { b: 3, a: 2 });
        expect(add3(10)).to.equal(13);
        expect(add3()).to.equal(5);

        const add4 = commonService.defaultArguments(add, { c: 4 });
        expect(isNaN(add4(10))).to.be.true;
        expect(add4(10, 10)).to.equal(20);

        const add5 = commonService.defaultArguments(add2, { a: 10 });
        expect(add5()).to.equal(19);
    });
    // task 3
    it("should return the earliest meeting", () => {
        const commonService = new CommonService()
        const schedules = [
            [['09:00', '11:30'], ['13:30', '16:00'], ['16:00', '17:30'], ['17:45', '19:00']],
            [['09:15', '12:00'], ['14:00', '16:30'], ['17:00', '17:30']],
            [['11:30', '12:15'], ['15:00', '16:30'], ['17:45', '19:00']]
        ];

        const duration = 60;

        const earliest = commonService.findEarliestMeeting(schedules, duration);
        expect(earliest).to.equal("12:15")
    })
})