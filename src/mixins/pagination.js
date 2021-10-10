/**
 * @mixin pagination
 */
export const pagination = {
  name: 'pagination',
  /**
   * @namespace data 混入数据结构
   * @property {object} pageInfo 分页参数
   * @property {array} pageList 列表数据
   * @property {number} total 数据总页数
   * @property {boolean} loadend 是否加载完毕
   * @property {boolean} refreshLoading 是否处于刷新列表加载状态
   * @property {boolean} loading 是否处于列表加载状态
   * @property {boolean} listError 是否处于加载错误状态
   * @property {boolean} key 列表项主键， 用于去重
   * @returns {data} 混入数据
   */
  /**
   * 列表格式(请在services进行处理)
   * {
      data: [],
      next: 0,
      total: 100,
      nextId?: 1
    }
  */
  data () {
    return {
      pageInfo: {
        page: 1,
        limit: 20
      },
      pageList: [],
      total: 0,
      loadend: false,
      initLoading: false,
      refreshLoading: false,
      loading: false,
      listError: false,
      nextId: '',
      isError: false,
      isNext: 0,
      in_city: false,
      other: {}
    }
  },
  watch: {
    other (val) {
      this.$emit('otherChange', val)
    }
  },
  methods: {
    /**
     * 刷新列表
     * @param {object} params 除分页参数外的其他参数
     */
    async refresh (params = {}) {
      this.pageInfo = {
        page: 1,
        limit: 20
      }
      this.nextId = ''
      this.refreshLoading = true
      await this.getListForPage(params)
      this.refreshLoading = false
    },
    async getInitList (params = {}) {
      this.pageInfo = {
        page: 1,
        limit: 20
      }
      this.nextId = ''
      this.initLoading = true
      await this.getListForPage(params)
      this.initLoading = false
    },
    /**
     * 请求下一页数据
     * @param {object} params 除分页参数外的其他参数
     */
    async loadNextPage (params = {}) {
      console.log('loadNextPage')
      if (this.loadend) {
        return
        // const err = new Error()
        // err.msg = '暂无新数据'
        // return Promise.reject(err)
      }
      this.pageInfo.page += 1
      console.log('-----', params)
      await this.getListForPage(params)
    },

    /**
     * 请求当前页数据
     * @param {object} params 除分页参数外的其他参数
     */
    async getListForPage (params = {}) {
      const { page, limit } = this.pageInfo
      this.loading = true
      const res = await this.getList({
        page,
        limit,
        ...params
      }).catch(err => {
        this.isError = true
        this.loading = false
        console.log('列表加载出错err----', err)
        return Promise.reject(err)
      })
      this.loading = false
      const loadend = res.next === 0
      this.nextId = res.next_id
      const list = this.formatData ? this.formatData(res.data) : res.data
      this.isNext = res.next || 0
      this.in_city = res.in_city
      if (page === 1) {
        this.pageList = list
      } else {
        // 拼接去重
        this.pageList = this.pageList.concat(list)
      }
      const other = {
        ...res,
        pageList: this.pageList
      }
      // delete other.data
      this.other = other
      this.loadend = loadend
      this.total = res.total
    }
  },
  mounted () {
    if (!this.getList) {
      console.error(`${this.$options.name} 组件引用了pagination mixins, 但未声明getList函数`)
    }
  }
}
