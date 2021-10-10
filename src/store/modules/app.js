const TYPES = {
  SYSTEM_INFO: 'SYSTEM_INFO', // 系统信息
  USER_INFO: 'USER_INFO'
}

const state = {
  systemInfo: {},
  userInfo: {}
}

// getters
const getters = {
}

// actions
const actions = {
  systemInfo ({ commit }, systemInfo = {}) {
    commit(TYPES.SYSTEM_INFO, { ...state.systemInfo, ...systemInfo })
  },
  // 更新用户信息
  updateUserInfo ({ commit }, userInfo = {}) {
    commit(TYPES.USER_INFO, { ...state.userInfo, ...userInfo })
  },
  // 更新倒数日总数
  updateCount ({ commit }, change = 0) {
    const countdownCount = (state.userInfo.countdownCount || 0) + change
    commit(TYPES.USER_INFO, { ...state.userInfo, countdownCount })
  },
  // 更新分类数量
  updateCategoryCount ({ commit }, { id = '', change = 0 }) {
    if (!id || !change) {
      return
    }
    const list = (state.userInfo.categoryList || []).map(item => {
      if (item.id === id) {
        return {
          ...item,
          count: item.count + change
        }
      }
      return item
    })
    commit(TYPES.USER_INFO, { ...state.userInfo, categoryList: list })
  }
}

// mutations
const mutations = {
  [TYPES.SYSTEM_INFO] (state, systemInfo) {
    state.systemInfo = { ...state.systemInfo, ...systemInfo }
  },
  [TYPES.USER_INFO] (state, userInfo) {
    state.userInfo = { ...state.userInfo, ...userInfo }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
