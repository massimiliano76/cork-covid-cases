/* eslint-disable no-shadow */
import { createStore } from 'vuex';
import moment from 'moment';
import { groupBy } from 'lodash';
import caseData from '@/data.json';
import util from '@/util';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const state = {
  totalIrishCases: 0,
  totalIrishDeaths: 0,
  totalIrishCasesInPast30Days: 0,
  totalIrishDeathsInPast30Days: 0,
  totalIrishCasesInPast14Days: 0,
  totalIrishDeathsInPast14Days: 0,
  changeInIrishCases: 0,
  changeInIrishDeaths: 0,
  latestIrishDataDateTime: 0,
  totalCorkCases: 0,
  totalCorkCasesInPast30Days: 0,
  totalCorkCasesInPast14Days: 0,
  latestCorkDataDateTime: 0,
  allCorkData: [],
  orderedCorkData: [],
  pastThreeMonthCorkData: [],
  allIrishData: [],
  orderedIrishData: [],
  pastThreeMonthIrishData: [],
  countyData: {},
};

const mutations = {
  SET_IRISH_TOTALS(state, data) {
    state.totalIrishCases = data.totalIrishCases;
    state.totalIrishDeaths = data.totalIrishDeaths;
    state.totalIrishCasesInPast30Days = data.totalIrishCasesInPast30Days;
    state.totalIrishCasesInPast14Days = data.totalIrishCasesInPast14Days;
    state.totalIrishDeathsInPast30Days = data.totalIrishDeathsInPast30Days;
    state.totalIrishDeathsInPast14Days = data.totalIrishDeathsInPast14Days;
    state.changeInIrishCases = data.changeInIrishCases;
    state.changeInIrishDeaths = data.changeInIrishDeaths;
    state.latestIrishDataDateTime = data.latestIrishDataDateTime;
  },

  SET_CORK_TOTALS(state, data) {
    state.totalCorkCases = data.totalCorkCases;
    state.totalCorkCasesInPast30Days = data.totalCorkCasesInPast30Days;
    state.totalCorkCasesInPast14Days = data.totalCorkCasesInPast14Days;
    state.latestCorkDataDateTime = data.latestCorkDataDateTime;
  },

  SET_CORK_DATA(state, { orderedCorkData, allCorkData }) {
    state.orderedCorkData = orderedCorkData;
    state.allCorkData = allCorkData;
  },

  SET_IRISH_DATA(state, { orderedIrishData, allIrishData }) {
    state.orderedIrishData = orderedIrishData;
    state.allIrishData = allIrishData;
  },

  SET_COUNTY_DATA(state, countyData) {
    state.countyData = countyData;
  },
};

const actions = {
  processData({ commit }) {
    const totalIrishCases = util.formatNumber(caseData.totalIrishCases);
    const totalIrishDeaths = util.formatNumber(caseData.totalIrishDeaths);
    const { changeInIrishCases, changeInIrishDeaths } = caseData;
    const totalIrishCasesInPast30Days = util.formatNumber(caseData.irishCasesInPast30Days);
    const totalIrishCasesInPast14Days = util.formatNumber(caseData.irishCasesInPast14Days);
    const totalIrishDeathsInPast30Days = util.formatNumber(caseData.irishDeathsInPast30Days);
    const totalIrishDeathsInPast14Days = util.formatNumber(caseData.irishDeathsInPast14Days);

    const latestIrishDataDateTime = moment(caseData.latestIrishDataDateTime).format('Do MMMM YYYY');

    const totalCorkCases = util.formatNumber(caseData.totalCasesInCork);
    const totalCorkCasesInPast30Days = util.formatNumber(caseData.totalCorkCasesInPast30Days);
    const totalCorkCasesInPast14Days = util.formatNumber(caseData.totalCorkCasesInPast14Days);
    const latestCorkDataDateTime = moment(caseData.latestCorkDataDateTime).format('Do MMMM YYYY');

    const allCorkData = caseData.corkData.sort((a, b) => new Date(a.date) - new Date(b.date));
    const allIrishData = caseData.irishData.sort((a, b) => new Date(a.date) - new Date(b.date));

    const { countyData } = caseData;

    // Group the data nicely by months in reverse
    const groupedCorkData = groupBy(allCorkData, (r) => moment(r.date).format('MMMM'));
    const orderedCorkData = [];

    const groupedIrishData = groupBy(allIrishData, (r) => moment(r.date).format('MMMM'));
    const orderedIrishData = [];

    MONTHS.reverse().forEach((month) => {
      if (groupedCorkData[month]) {
        orderedCorkData.push({
          month,
          data: groupedCorkData[month].sort((a, b) => new Date(a) - new Date(b)),
        });
      }

      if (groupedIrishData[month]) {
        orderedIrishData.push({
          month,
          data: groupedIrishData[month].sort((a, b) => new Date(a) - new Date(b)),
        });
      }
    });

    commit('SET_IRISH_TOTALS', {
      totalIrishCases,
      totalIrishDeaths,
      changeInIrishCases,
      changeInIrishDeaths,
      totalIrishCasesInPast30Days,
      totalIrishCasesInPast14Days,
      totalIrishDeathsInPast30Days,
      totalIrishDeathsInPast14Days,
      latestIrishDataDateTime,
    });

    commit('SET_CORK_TOTALS', {
      totalCorkCases,
      totalCorkCasesInPast30Days,
      totalCorkCasesInPast14Days,
      latestCorkDataDateTime,
    });

    commit('SET_CORK_DATA', { orderedCorkData, allCorkData });
    commit('SET_IRISH_DATA', { orderedIrishData, allIrishData });
    commit('SET_COUNTY_DATA', countyData);
  },
};

const getters = {};

const store = createStore({
  state,
  mutations,
  actions,
  getters,
});

export default store;
