<template>
  <div class="page">
    <!--流程详情区域-->
    <div class="process-detail">
      <div class="process-item" v-for="(item, index) in processDetail" :key="index">
        <div :class="{ 'padding-32': item.name !== 'Table' }">
          <!-- {{item}} -->
          <!--单文本-->
          <template v-if="item.name === 'TextInput'">
            <template v-if="item.perm === 'E'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-filed-bg">
                <van-field v-model="item.value" :maxlength="item.props.maxLength || 100" :placeholder="item.props.placeholder" />
              </div>
            </template>
            <template v-else-if="item.perm === 'R'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-label-content">{{item.value}}</div>
              <van-divider />
            </template>
          </template>
          <!--多行文本-->
          <template v-if="item.name === 'TextareaInput'">
            <template v-if="item.perm === 'E'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-filed-bg">
                <van-field v-model="item.value" type="textarea" rows="3" :maxlength="item.props.maxLength || 1000" :placeholder="item.props.placeholder" />
              </div>
            </template>
            <template v-else-if="item.perm === 'R'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-label-content">{{item.value}}</div>
            </template>
          </template>
          <!--输入数字-->
          <template v-if="item.name === 'NumberInput'">
            <template v-if="item.perm === 'E'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-filed-bg">
                <van-field v-model="item.value" type="digit" :placeholder="item.props.placeholder" />
              </div>
            </template>
            <template v-else-if="item.perm === 'R'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-label-content">{{item.value}}</div>
            </template>
          </template>
          <!--配件编码-->
          <template v-if="item.name === 'PartCode'">
            <template v-if="item.perm === 'E'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-filed-bg">
                <van-field
                  v-model="item.value.value"
                  is-link
                  readonly
                  name="picker"
                  placeholder="点击选择配件编码"
                  @click="selectData(item.id,'partCode',{name: '',value: undefined,props: {multiple: false,remote: false}})"
                />
              </div>
              <!-- 描述 -->
              <div class="process-filed-bg ">
                <div class="part-code-desc">
                  {{Object.keys(item.value).length === 0 ? '自动带出配件名称' :item.value.label}}
                </div>
              </div>
            </template>
            <template v-else-if="item.perm === 'R'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-label-content">{{item.value.value}}</div>
              <div class="process-label-content">{{item.value.label}}</div>
              <van-divider />
            </template>
          </template>
          <!--产品线-->
          <template v-if="item.name === 'ProductLine'">
            <template v-if="item.perm === 'E'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-filed-bg">
                <van-field
                  v-model="item.value.label"
                  is-link
                  readonly
                  name="picker"
                  placeholder="点击选择"
                  @click="selectData(item.id,'productLine',{name: '',value: undefined,props: {multiple: false,remote: false}})"
                />
              </div>
            </template>
            <template v-else-if="item.perm === 'R'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-label-content">{{item.value.label}}</div>
            </template>
          </template>
          <!--产品型号-->
          <template v-if="item.name === 'ProductModel'">
            <template v-if="item.perm === 'E'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-filed-bg">
                <van-field
                  v-model="item.value.label"
                  is-link
                  readonly
                  name="picker"
                  placeholder="点击选择"
                  @click="selectData(item.id,'productModel',{name: '',value: undefined,props: {multiple: false,remote: false}})"
                />
              </div>

            </template>
            <template v-else-if="item.perm === 'R'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.value.title}}</div>
              <div class="process-label-content">{{item.value.value}}</div>
            </template>
          </template>
          <!--扫描-->
          <template v-if="item.name === 'PTSScan'">
            <template v-if="item.perm === 'E'">
              <div class="flex-Box">
                <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              </div>
              <div class="process-filed-bg flex-Box">
                <van-field v-model="item.code" :placeholder="item.props.placeholder || '条码'" @click="selectPTS(item.id)"/>
                <scan-qrcode style="width:40px;height:40px" @getScanCode="scanQrCode" />
              </div>
              <div class="process-filed-bg pts-box-item" v-if="item.lineName ==null">
                <van-field
                v-model="item.model"
                  is-link
                  readonly
                  name="picker"
                  placeholder="请选择产品型号"
                  @click="selectData(item.id,'modelGetPdt',{name: '',value: undefined,props: {multiple: false,remote: false}})"
                />
              </div>
              <div class="process-filed-bg pts-box-item" v-else>
                <van-field
                  v-model="item.model"
                  readonly
                  disabled
                  placeholder="请选择产品型号"
                />
              </div>
              <div class="process-filed-bg pts-box-item">
                <van-field
                  v-model="item.lineName"
                  readonly
                  disabled
                  placeholder="自动带出产品线"
                />
              </div>
            </template>
            <template v-else-if="item.perm === 'R'">
              <div class="process-label-title">{{item.value.title}}</div>
              <div class="process-label-content">{{item.value.code}}</div>
              <div class="process-label-content">{{item.value.model}}</div>
              <div class="process-label-content">{{item.value.lineName}}</div>
            </template>
          </template>
          <!--单选-->
          <template v-if="item.name === 'SelectInput'">
            <template v-if="item.perm === 'E'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-filed-bg">
                <van-field
                  v-model="item.value"
                  is-link
                  readonly
                  name="picker"
                  placeholder="点击选择"
                  @click="changeSelectInput(item)"
                />
              </div>
            </template>
            <template v-else-if="item.perm === 'R'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-label-content">{{item.value}}</div>
            </template>
          </template>
      
          <!--多选-->
          <template v-if="item.name === 'MultipleSelect'">
            <template v-if="item.perm === 'E'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-filed-checkbox">
                <van-checkbox-group v-model="item.value" checked-color="#FF7515" direction="horizontal" @change="changeCheckbox(item, $event)">
                  <van-checkbox v-for="checkItem in item.props.options" :key="checkItem" :name="checkItem" shape="square">{{checkItem}}</van-checkbox>
                </van-checkbox-group>
              </div>
            </template>
            <template v-else-if="item.perm === 'R'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-label-content"><span v-for="(contItem, index) in item.value" :key="index">{{contItem + ' '}}</span></div>
              <van-divider />
            </template>
          </template>
          <!--日期-->
          <template v-if="item.name === 'DateTime'">
            <template v-if="item.perm === 'E'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-filed-bg calendar-date" @click="changeSingleDate(item)">
                <van-field
                  v-model="item.value"
                  readonly
                  left-icon="notes-o"
                  placeholder="选择日期"
                />
              </div>
            </template>
            <template v-else-if="item.perm === 'R'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-label-content">{{item.value}}</div>
              <van-divider />
            </template>
          </template>
          <!--日期范围-->
          <template v-if="item.name === 'DateTimeRange'">
            <template v-if="item.perm === 'E'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-filed-bg calendar-group" @click="changeDateRange(item)">
                <van-field
                  v-model="item.value[0]"
                  readonly
                  left-icon="notes-o"
                  placeholder="开始时间"
                />
                <span>-</span>
                <van-field
                  v-model="item.value[1]"
                  readonly
                  left-icon="notes-o"
                  placeholder="结束时间"
                />
              </div>
            </template>
            <template v-else-if="item.perm === 'R'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-label-content">{{`${item.value[0]} ~ ${item.value[1]}`}}</div>
            </template>
          </template>
          <!--上传图片-->
          <template v-if="item.name === 'ImageUpload'">
            <template v-if="item.perm === 'E'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-label-content">
                <div class="img-list" :key="index" v-for="(imgItem, index) in item.value" @click="previewImage(item.value, index)">
                  <van-icon name="clear" @click.stop="deleteImg(index, item)"/>
                  <img class="process-label-img" :src="imgItem.fileUrl" :alt="imgItem.name || '图片'"/>
                </div>
                <van-uploader v-if="item.value.length < item.props.maxNumber" multiple :after-read="(file)=>afterReadImg(file, item)"/>
              </div>
            </template>
            <template v-else-if="item.perm === 'R'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-label-content">
                <div class="img-list" :key="index" v-for="(imgItem, index) in item.value" @click="previewImage(item.value, index)">
                  <img class="process-label-img" :src="imgItem.fileUrl" alt="预览"/>
                </div>
              </div>
            </template>
            <van-divider />
          </template>
          <!--上传文件-->
          <template v-if="item.name === 'FileUpload'">
            <template v-if="item.perm === 'E'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-label-content">
                <div class="process-label-file" :key="index" v-for="(fileItem, index) in item.value" @click="previewFile(fileItem)">
                  <van-icon name="link-o" /><span>{{fileItem.name}}</span><van-icon name="clear" @click.stop="deleteFile(index, item)"/>
                </div>
                <van-uploader multiple v-if="item.value.length < item.props.maxNumber" :accept="acceptType" :after-read="(file) => afterReadFile(file, item)">
                  <div class="upload-file-btn"><van-icon name="link-o" />上传附件</div>
                </van-uploader>
              </div>
            </template>
            <template v-else-if="item.perm === 'R'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-label-content">
                <div class="process-label-file" :key="index" v-for="(fileItem, index) in item.value">
                  <van-icon name="link-o" /><span>{{fileItem.name}}</span>
                </div>
              </div>
            </template>
            <van-divider />
          </template>
          <!--下载文件-->
          <template v-if="item.name === 'FileDownload'">
            <div class="process-label-title">{{item.title}}</div>
            <div class="process-label-content">
              <div class="upload-file-btn" @click="previewFile(item.props)">
                <van-icon name="link-o" /><span>下载文件</span>
              </div>
            </div>
            <van-divider />
          </template>
          <!--人员选择-->
          <template v-if="item.name === 'UserPicker'">
            <template v-if="item.perm === 'E'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-label-content">
                <div class="process-label-user"><span v-for="(contItem, index) in item.value" :key="index">{{contItem.name + ''}}</span></div>
                <div class="border-btn" @click="choosePerson(item)">选择人员</div>
              </div>
            </template>
            <template v-else-if="item.perm === 'R'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <div class="process-label-content">
                <div class="process-label-user"><span v-for="(contItem, index) in item.value" :key="index">{{contItem.name + ''}}</span></div>
              </div>
            </template>
          </template>
          <!--组合-->

          <!--星级-->
          <template v-if="item.name === 'Star'">
            <template v-if="item.perm === 'E'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <van-field name="rate" label="评分">
                <template #input>
                  <van-rate v-model="item.value" />
                </template>
              </van-field>
            </template>
            <template v-else-if="item.perm === 'R'">
              <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
              <van-field name="rate" label="评分" readonly>
                <template #input>
                  <van-rate v-model="item.value" />
                </template>
              </van-field>
            </template>
          </template>
          <!--提示-->
          <template v-if="item.name === 'Description'">
            <div class="flex-left">
              <span class="copy-icon"></span>
              <div class="flex-content">{{item.title}}</div>
            </div>
          </template>
          <!--表单-->
          <template v-if="item.name === 'Table'">
            <div :class="['table-box', index === processDetail.length - 1 && item.perm !== 'E' ? '' : 'table-box-border', item.perm !== 'E' ? 'table-box-padding-bottom' : '']">
              <div class="table-title">
                {{ item.title }}
                <van-icon v-if="item.props.placeholder" name="info-o" @click="showTableInfo(item.props.placeholder)" />
              </div>
              <div class="table-content">
                <div v-for="(val, index) in item.value" :key="index" class="table-con-box">
                  <div class="table-con-title">
                    <div>表格明细({{ index + 1 }})</div>
                    <van-icon name="delete-o" @click="delTable(item, index)" />
                  </div>
                  <div v-for="(col, ind) in item.props.columns" :key="ind" class="table-filed">
                    <template v-if="item.perm === 'E'">
                      <div class="table-filed-title">{{col.title}}</div>
                      <div class="table-filed-value">
                        <van-field v-model="val[col.field]" rows="1" autosize type="textarea" :maxlength="item.props.maxLength || 100" placeholder="请输入" />
                      </div>
                    </template>
                    <template v-else-if="item.perm === 'R'">
                      <div class="table-filed-title">{{col.title}}</div>
                      <div class="table-filed-title">{{val[col.field]}}</div>
                    </template>
                  </div>
                </div>
                <div class="table-add" @click="addTable(item)">
                  <van-icon name="plus" />新增明细</div>
              </div>
            </div>
          </template>
          <!--接口选择框-->
          <template v-if="item.name === 'SelectInterface'">
              <template v-if="item.perm === 'E'">
                <!-- 单选、不远程 -->
                <template v-if="!item.props.multiple && !item.props.remote">
                  <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                  <div class="process-filed-bg">
                    <van-field
                      v-model="item.props.text"
                      is-link
                      readonly
                      name="picker"
                      placeholder="点击选择"
                      @click="getAjax(item,'')"
                    />
                  </div>
                </template>
                <!-- 单选、远程 -->
                <template v-if="!item.props.multiple && item.props.remote">
                  <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                  <div class="process-filed-bg">
                    <van-field
                      v-model="item.props.text"
                      is-link
                      readonly
                      name="picker"
                      placeholder="点击选择"
                      @click="selectData(item.id,'getAjax',item)"
                    />
                  </div>
                </template>
                <!-- 多选、不远程 -->
                <template v-if="item.props.multiple && !item.props.remote">
                  <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                  <div class="process-filed-bg">
                    <van-field
                      v-model="item.props.text"
                      is-link
                      readonly
                      name="picker"
                      placeholder="点击选择"
                      @click="selectData(item.id,'getAjax',item)"
                    />
                  </div>
                </template>
                <!-- 多选、远程 -->
                <template v-if="item.props.multiple && item.props.remote">
                  <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                  <div class="process-filed-bg">
                    <van-field
                      v-model="item.props.text"
                      is-link
                      readonly
                      name="picker"
                      placeholder="点击选择"
                      @click="selectData(item.id,'getAjax',item)"
                    />
                  </div>
                </template>
              </template>
              <template v-else-if="item.perm === 'R'">
                <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                <div class="process-label-content">{{item.value}}</div>
              </template>
          </template>
        </div>
      </div>
      <div class="getUp-Box"></div>
      
      <div class="btn-group">
        <div class="btn btn-default" @click="returnWork">
          取消发起
        </div>
        <div class="btn btn-primary" @click="saveData">
          发起流程
        </div>
      </div>
    </div>

    <!--单选弹出框-->
    <van-popup v-model:show="showSelectInputPicker" position="bottom" :style="{ height: '40%', width: bodyWidth + 'px', left:'50%', transform: `translateX(-50%)`}">
      <van-picker
        :columns="selectInputOptions"
        @confirm="selectInputOnConfirm"
        @cancel="showSelectInputPicker = false"
      />
    </van-popup>
    <!--日历-->
    <van-calendar v-model:show="showSingleTime" :style="{ height: '70%', width: bodyWidth + 'px', left:'50%', transform: `translateX(-50%)`}" @confirm="singlDateOnConfirm" :min-date="minDate"  color="#FF7515"/>
    <!--日期范围 日历-->
    <van-calendar v-model:show="showGroupTime" :style="{ height: '70%', width: bodyWidth + 'px', left:'50%', transform: `translateX(-50%)`}" :default-date="defaultDate.arr" :min-date="minDate" type="range" @confirm="groupTimeOnConfirm" color="#FF7515"/>
    <!-- 日期时间选择 -->
    <DataTime
      :values="dataTime"
      @changeValue="showPickerDataTime = false"
      :showPicker="showPickerDataTime"
      @confirm="onConfirmDataTime"
    />
    <!--操作记录区域-->
  </div>
  <!--型号&产品线弹窗-->
    <van-popup v-model:show="showSearch" round position="bottom" :style="{ height: '50%', width: bodyWidth + 'px', left:'50%', transform: `translateX(-50%)` }" >
      <van-search
        v-model="keyword"
        shape="round"
        placeholder="请输入关键字"
        @search="isProductLine? filterColumns(keyword) : getColumns(keyword)"
      />
      <van-cell-group style="height: 360px; overflow-y: scroll">
        <van-cell
          v-for="item in columns"
          :key="item.value"
          :title="item.label"
          :label="item.value"
          v-show="item.isShow"
          @click="onConfirm(item)"
        />
      </van-cell-group>
    </van-popup>
  <!--接口选择框-弹窗-->
    <van-popup v-model:show="showSelectAjaxPicker" position="bottom" :style="{ height: '40%', width: bodyWidth + 'px' }">
      <van-picker
        :title="ajaxPopupTitle"
        :columns="selectInputOptions"
        @confirm="selectAjaxOnConfirm"
        @cancel="showSelectAjaxPicker = false"
      />
    </van-popup>
    <van-popup v-model:show="showSearchAjax" round position="bottom" :style="{ height: 'calc(50% + 88px)', width: bodyWidth + 'px' }" >
      <div class="ajax-popup-title"><div>{{ ajaxPopupTitle }}</div></div>
      <van-search
        v-model="keyword"
        shape="round"
        placeholder="请输入关键字"
        @search="getColumnsAjax(keyword)"
      />
      <van-cell-group style="height: 360px; overflow-y: scroll">
        <van-cell
          v-for="item in columns"
          :key="item.value"
          :title="item.text"
          :label="item.value"
          v-show="item.isShow"
          @click="onConfirm(item)"
        />
      </van-cell-group>
    </van-popup>
  <!--接口选择框-弹窗-多选-->
    <van-popup v-model:show="showSearchAjaxMultiple" round position="bottom" :style="{ display: 'flex', 'flex-direction': 'column', height: 'calc(50% + 88px)', width: bodyWidth + 'px' }" >
      <div class="ajax-popup-title"><div>{{ ajaxPopupTitle }}</div></div>
      <van-search
        v-if="showSearchAjaxItem.props.remote"
        v-model="keyword"
        shape="round"
        placeholder="请输入关键字"
        @search="getColumnsAjax(keyword)"
      />
      <div class="process-popup-checkbox">
        <van-checkbox-group v-model="selectInputOptionsMultiple" checked-color="#FF7515" direction="horizontal" @change="changeCheckboxAjax($event)">
          <van-cell-group inset>
            <van-cell
              v-for="(item, index) in selectInputOptions"
              clickable
              :key="item"
              :title="(item as any).text"
              @click="toggle(index)"
            >
              <template #right-icon>
                <van-checkbox
                  :name="item"
                  shape="square"
                  :ref="el => checkboxRefs[index] = el"
                  @click.stop
                />
              </template>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </div>
    </van-popup>
  <!--页面加载中-->
  <van-overlay :show="loading" @click="loading = false" class="loading-box">
    <van-loading />
  </van-overlay>
  <!--人员选择-->
  <van-overlay :show="showSelect" z-index="1000" class-name="default-overlay">
    <div class="select-person-box" :style="{ width: bodyWidth + 'px', left:'50%', transform: `translateX(-50%)`}">
      <div class="add-people-box">
        <div class="box-title"><span></span>添加人员</div>
        <div class="box-content">
          <div class="box-no-data" v-if="!userList.arr.length">
            <noDataDefault :message="'暂未选择人员'"/>
          </div>
          <div class="box-content-item" v-for="(item, index) in userList.arr" :key="index">
            <span>{{item.name}}</span>
            <img src="https://res.joyoung.com/07/01/icon_reduce.png" @click="deleteUser(index, userList.arr)" alt="删除"/></div>
        </div>
      </div>
      <div class="filter-box">
        <filterTree ref="child" @sendUser="handle"></filterTree>
      </div>
      <div class="btn-group">
        <div class="btn btn-default" @click="showSelect = false">
          取消
        </div>
        <div class="btn btn-primary" @click="selectPersonBtnSubmit">
          确认
        </div>
      </div>
    </div>
  </van-overlay>
</template>

<script setup lang="ts">
import DataTime from '@/components/datatime.vue'
import scanQrcode from '@/components/scan-qrcode.vue'
import filterTree from '@/component/filterTree.vue'
import noDataDefault from '@/component/noDataDefault.vue'

import router from '@/router'
import dayjs from 'dayjs'
import { showImagePreview, showDialog, showSuccessToast, showToast } from 'vant'
import { reactive, ref, onActivated } from 'vue'
import { useRoute } from 'vue-router'
import { ossUploadFile, getFileUrlV2, cloudOssUpload } from '@/utils/oss'
import { getDetail,getProductLine,getParts,submitData,getModel,getPtsCode,getAjaxData } from '@/api/createProcess'
const route = useRoute()
const child = ref()
const showSelectInputPicker = ref(false) // 弹出单选框
const selectInputOptions = ref([]) // 单选框内容

// 接口选择框
let ajaxPopupTitle = ref('')
const showSelectAjaxPicker = ref(false) // 弹出单选框
const selectAjaxOptions = ref([]) as any
let showSearchAjaxItem = ref({id:'',props: {}}) as any
let showSearchAjax = ref(false) // 通用弹窗
let showSearchAjaxMultiple = ref(false) // 通用弹窗
let selectInputOptionsMultiple = ref([]) as any

const checkboxRefs = ref([]) as any
const toggle = (index:number) => {
  checkboxRefs.value[index].toggle()
};

const currentKey = ref('') // 当前操作的key
const showSingleTime = ref(false)
const showGroupTime = ref(false) // 显示组合时间
let showSearch = ref(false) // 通用弹窗
let isProductLine = ref(false) // 是否是产品线
let fileLoading = ref(false) //上传文件
let imgLoading = ref(false) //上传文件
let keepId = ref('')
let dialogType = ref('')
const defaultDate = reactive({
  arr:[] as any[]
})
const minDate = new Date(2020, 1, 1)  // 日历最小值
const dataTime = ref(""); // 日期时间选择值定义
const showPickerDataTime = ref(false); // 日期时间选择弹框显隐
const onConfirmDataTime = (val: string | number | Date | dayjs.Dayjs | null | undefined) => {
  showPickerDataTime.value = false
  const key = currentKey.value
  const newVal = val
  handleProcessData(key, newVal)
}

const processArr = ref()
const loading = ref(false)
const processInfo = reactive({
  activeIndex: 0,
})
let processInstanceId = ''
let assignee = ''
let formItems: any[] = []
const processDetail:any = ref({}) 
const userId = localStorage.getItem('userInfo.userId')
let formPerms: { id: any; perm: any }[] = []
const approvel = ref() // 审批意见
let ptsCode:any = ref({}) //pts码
let keyword = ref('')
let processFormData:any = {}
// 产品线/型号
const columns:any = ref([]) 
// 暂存产品线
let processDefinitionId = ''
const showBtn = ref(false)
const isDisabled = ref(true)

// 人员选择
const showSelect = ref(false)
let oldUserList: any[] = []
const userList = reactive({
  arr: [] as any[]
}) 
const handle = (list: any) => {
  userList.arr = list
}
const bodyWidth = ref(document.body.clientWidth)
const acceptType = '.doc,.docx,.txt,.pdf,.ppt,.pptx,.xlsx,.xls,.avi,.mov,.mkv,.mpeg,.3gp,.wmv,.mp4,.flv,text/plain,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation'
// 人员选择
async function choosePerson(item: any) {
  currentKey.value = item.id
  window.processDetail = processDetail.value
  window.userList = item.value || []
  window.keys = item.id
  router.push({
    path: '/selectUser'
  })
}
// 删除选中人员
function deleteUser(index: any, item: any) {
  const key = currentKey.value
  let newVal = item.splice(index, 1)
  child.value.setUserList(newVal)
  handleProcessData(key, newVal)
}
// 在组件进入页面时获取接口数据
onActivated(() => {
  const query = route.query
  processInstanceId = query.processInstanceId as string
  if (window.pathFrom === '/selectUser') {
    processDetail.value = window.processDetail
    const key = window.keys
    const item = window.userList
    handleProcessData(key as any, item)
  } else {
    getData()
  }
})

// PTS
function selectPTS(id:any){
  keyword.value=''
  columns.value = []
  showSearch.value = true
  keepId = id
  dialogType.value = 'PTSScan'
}
// 搜索框开启
interface ItemProps {
  multiple: boolean;
  remote: boolean
}
interface Item {
  title?: string;
  name: string;
  value: any;
  props: ItemProps
}
function selectData(id:any,type:string,item:Item) {
  ajaxPopupTitle.value = item.title as string
  keyword.value=''
  columns.value = []
  selectInputOptions.value = item.value || []
  selectInputOptionsMultiple.value = item.value || []
  if(item.name === 'SelectInterface' && !item.props.multiple && item.props.remote) {
    // 单选、远程搜索
    showSearchAjaxItem.value = item
    showSearchAjax.value = true
  } else if (item.name === 'SelectInterface' && item.props.multiple) {
    // 多选、不远程/远程 搜索
    showSearchAjaxItem.value = item
    if (!item.props.remote) {
      getAjax(item, '')
    } else {
      showSearchAjaxMultiple.value = true
    }
  } else {
    showSearch.value = true
  }
  keepId = id
  dialogType.value = type
  getColumns()
}
function getColumnsAjax (_keyword:any = '') {
  const item = showSearchAjaxItem.value
  getAjax(item, _keyword)
}
// 加载下拉框接口数据
interface ItemProps { 
  gateway?: string; 
  href?: string; 
  method?: string; 
  params?: string; 
  optionLabel?: string; 
  optionValue?: string; 
  remote: boolean; 
  multiple: boolean 
}

interface Item {
  id?: any; 
  title?: string;
  props: ItemProps;
  value: any;
}
function getAjax (item: Item, _keyword: string) {

  var i:number = 0
  const {gateway, href, method, params, remote, multiple} = item.props
  const label = (item.props.optionLabel as string)
  const value = (item.props.optionValue as string)
  ajaxPopupTitle.value = item.title as string
  if (!remote) {
    // 只有非远程的需要记录历史options，防止多次加载
    for(i; i < selectAjaxOptions.value.length; i++) {
      if (selectAjaxOptions.value[i].id === item.id){
        if (!multiple) {
          showSelectAjaxPicker.value = true
        } else {
          showSearchAjaxMultiple.value = true
        }
        currentKey.value = item.id
        selectInputOptions.value = selectAjaxOptions.value[i].options
        return
      }
    }
  }
  const paramsObj = params ? {[params]: _keyword} : {}
  loading.value=true
  getAjaxData({
    gateWay: gateway, // mServer aiot custom
    reqUrl: href, // 请求地址
    reqMethod: method, // GET、POST
    reqParams: paramsObj // 请求参数
  }).then(res => {
    if (res.code === 'success' || res.code === '0') {
      loading.value=false
      // 单选/多选、不远程
      if(!remote) {
        const list = res.data.map((val: { [key: string]: any }) => {
          return {
            text: val[label.split(',')[0]],
            value: val[value]
          }
        })
        // 只有非远程的需要记录历史options，防止多次加载
        selectAjaxOptions.value.push({
          id: item.id,
          options: list
        })
        if (!multiple) {
          showSelectAjaxPicker.value = true
        } else {
          showSearchAjaxMultiple.value = true
        }
        currentKey.value = item.id
        selectInputOptions.value = list
      } else if (!multiple && remote) {
        // 单选、远程
        columns.value = res.data.map((val: { [key: string]: any })=>{
          return {
            isShow: true,
            text: val[label.split(',')[0]],
            value: val[value]
          }
        })
      } else if (multiple && remote) {
        // 多选、远程
        const list = res.data.map((val: { [key: string]: any }) => {
          return {
            text: val[label.split(',')[0]],
            value: val[value]
          }
        })
        if (item.value.length) {
          list.push(...item.value)
        }
        currentKey.value = item.id
        selectInputOptions.value = list
        
      }
    }else{
      showDialog({
        message: res.message,
      })
    }
  }, err => {
    loading.value=false
  })
}
function getPartCode (_keyword:any = '') {
 getParts({
      searchText:_keyword
    }).then(res => {
      if (res.code==='0') {
        columns.value = res.data.map((item: { name: any,label: any,code:any,value:any })=>{
          return {
            isShow:true,
            label: item.name,
            value:item.code
          }
        })
      }else{
        showDialog({
          message: res.message,
        })
      }
    })
}
function getLineCode (_keyword:any = '') {
 getProductLine({}).then(res => {
  if (res.code==='0') {
    columns.value = res.data.map((item: { label: any, value: any,isShow: boolean })=>{
      return{
        isShow:item.label.indexOf(_keyword) !== -1,
        label: item.label,
        value:item.value
      }
    })
  }else{
    showDialog({
      message: res.message,
    })
  }
})
}
function getModelCode (_keyword:any = '') {
getModel({
      searchText:_keyword
    }).then(res => {
      if (res.code==='0') {
        columns.value = res.data.map((item: {lineCode: any, code: any, model: any })=>{
          return {
            isShow:true,
            label:item.model,
            value:item.code,
            lineCode:item.lineCode
          }
        })
      }else{
        showDialog({
          message: res.message,
        })
      }
    })
}
function getPtsCodes (_keyword:any = '') {
  getPtsCode({
    code:_keyword
  }).then(res => {
    if (res.code==='0') {
      columns.value = [
        {
          isShow:true,
          label:res.data.model,
          lineName:res.data.lineName,
          value:_keyword
        }
      ]
    }else{
      showDialog({
        message: res.message,
      })
    }
  })
}
// 下拉勾选
function getColumns (_keyword:any = '') {
  switch (dialogType.value) {
    case 'partCode':
      getPartCode(_keyword)
      break;
    case 'productLine':
      getLineCode(_keyword)
      break;
    case 'productModel':
      getModelCode(_keyword)
      break;
    case 'PTSScan':
      getPtsCodes(_keyword)
      break;
    case 'modelGetPdt':
      getModelCode(_keyword)
      break;
    default:
      break;
  }
}
// 扫码
function scanQrCode (e:any) {
  isDisabled.value = true
  ptsCode = handleQRCode(e)
  getPtsModel(ptsCode.pts)
}
// 二维码截取
const handleQRCode = (urlParam: string): { pts: string } => {
  // 2024-03-02 添加 pts 码识别规则
  /**
   *  1、整个字符串中，包含  “=”；
   *  2、前：p=或 s=之前为？或&或#分隔符；
   */
  let code = '';
  let url = urlParam.replace(/\？/g, '?');
  url = url.replace(/\;/g, '');
  const isParams = url.indexOf('?') > -1;
  const paramsAll = isParams? url.split('?').slice(1) : [url];
  let paramsArr: string[] = [];
  if (paramsAll.length === 1) {
    paramsArr = paramsAll[0].split('&');
  } else {
    paramsAll.forEach((item) => {
      const itemSplit = item.split('&');
      paramsArr = paramsArr.concat(itemSplit);
    });
  }
  if (paramsArr.length === 1 && paramsAll[0].indexOf('=') === -1) {
    code = paramsAll[0];
  } else {
    let paramsP = false;
    paramsArr.forEach((item) => {
      const key = item.split('=')[0];
      const value = item.split('=')[1];
      if (key.toLowerCase().replace(/\s/g, '') === 'p') {
        paramsP = true;
        code = value;
      }
    });
    if (!paramsP) {
      paramsArr.forEach((item) => {
        const key = item.split('=')[0];
        const value = item.split('=')[1];
        if (key.replace(/\s/g, '') ==='s') {
          code = value;
        }
      });
    }
    if (code.indexOf('#')) {
      code = code.split('#')[0];
    }
  }  
  return {
    pts: code
  };
};
// 通过Pts码获取型号 再通过型号获取产品线
function getPtsModel(_keyword:any) {
  getPtsCode({
    code:_keyword
  }).then(res => {
    if (res.code==='0') {
      processDetail.value.forEach((item:any)=>{
        if (item.name==='PTSScan') {
          item.code = _keyword
          item.lineName = res.data.lineName
          item.model = res.data.model
        }
        getProductLine({}).then(result => {
          if (result.code==='0') {
            result.data.forEach((jtem:any)=>{
             // 如果 产品线接口中的名字相同 ，就给给pts的产品码code赋值
              if (jtem.label === result.data.lineName) {
                item.lineCode = jtem.value
              }
            })
          }else{
            showDialog({
              message: result.message,
            })
          }
        })
        
      })
    }else{
      showDialog({
        message: res.message,
      })
    }
  })
}
// 前端过滤新数组
function filterColumns (_keyword: any) {
  columns.value = columns.value.map((item: { label: any, value: any,isShow: boolean }) => {
    item.isShow = item.label.indexOf(_keyword) === -1 ? false :true
    return item
  });
}
// 流程详情
function getData() {
  const postObj = {
    templateId: processInstanceId,
  }
  getDetail(postObj).then(res => {
    if (res.code === '0') {
      const data = res.data || {}
      processDefinitionId = res.data.processDefinitionId
      formItems = JSON.parse(data.process).props.formPerms
      const arrayList = JSON.parse(data.formItems)
      arrayList.forEach((item:any,index:any)=>{
        console.log(item)
        item.perm = 'E'
        formItems.forEach((jtem:any)=>{
          if (jtem.id === item.id) {
            item.perm= jtem.perm
          }
        })
      })
      
      processDetail.value = arrayList.filter((item:any)=>{
        return item.perm !=='H'
      })
      
      loading.value=false
    } else {
      loading.value=false
    }
  }).catch(err => {
    loading.value=false
  })
}

// 各种弹窗确认内容
function onConfirm(val:any) {
  const oldArr = processDetail.value
  const newArr = oldArr.map((item: { id: any;value:any;label:any, lineName: any,code:any,lineCode:any,model:any, props: {text:any} }) => {
  if (item.id === keepId) {
     // 如果是手动pts码 再次走接口拿产品线 做对比
     if (dialogType.value === 'PTSScan') {
      item.code = val.value
      item.lineName = val.lineName
      item.model = val.label
      getProductLine({}).then(res => {
        if (res.code==='0') {
          res.data.forEach((jtem:any)=>{
            // 如果 产品线接口中的名字相同 ，就给给pts的产品码code赋值
            if (jtem.label === val.lineName) {
               item.lineCode = jtem.value
            }
          })
        }else{
          showDialog({
            message: res.message,
          })
        }
      })
    }
    else if(dialogType.value === 'modelGetPdt'){
      item.model = val.label
     getProductLine({}).then(res => {
        if (res.code==='0') {
          res.data.forEach((jtem:any)=>{
            if (jtem.value===val.lineCode) {
              item.lineName = jtem.label
            }
          })
        }else{
          showDialog({
            message: res.message,
          })
        }
      }) 
    }
    else if(dialogType.value === 'getAjax'){
      item.props.text = val.text
      item.value = [val]
    }
    else{
      item.value ={label:val.label,value:val.value} 
    }
  }
    return item
  })
  processDetail.value = newArr
  showSearch.value = false
  showSearchAjax.value = false
}
// 更新某个值
function handleProcessData(key: string, val: any) {
  const oldArr = processDetail.value
  const newArr = oldArr.map((item: { id: any; value: any,name:any,props:{text:any} }) => {
    if (item.id === key) {
      if (item.name === 'SelectInterface') {
        item.props.text = val.map((res: any) => {
          return res.text
        }).join('，')
      }
      item.value = val
    }
    return item
  })
  processDetail.value = newArr
}
// 处理提交数据
function handlePostData(data: any[]) {
  const result = data.reduce(
    (
    acc: { [x: string]: any }, 
    curr: { id: string | number; value: any,name:any,model:any,lineName:any,code:any,lineCode:any }
    ) => {
    if (curr.name === 'PTSScan') {
      acc[curr.id] = 
      { 
        'model':curr.model,
        'lineCode':curr.lineCode,
        'lineName':curr.lineName,
        'code':curr.code
      }
    }
    else{
      acc[curr.id] = curr.value;
    }
    return acc;
  }, {});
  return result
} 
// 点击提交
function saveData() {
  const formData = handlePostData(processDetail.value)
  const postObj = {
    processDefinitionId: processDefinitionId,
    formData: formData,
  }
  const table = processDetail.value.find((item: {name: string}) => item.name === 'Table')
  if (table) {
    const tableData = formData[table.id]
    if (!tableData.length) {
      showToast('请为表单增加明细')
      return
    } else {
      const dataList = tableData
      if (!dataList.length || isEmpty(dataList)) {
        showToast('请完善表单')
        return
      }
    }
  }
  submitData(postObj).then(res => {
    if (res.code==='0') {
      showSuccessToast('提交成功！')
      window.localStorage.setItem('tab', '3')
      router.go(-2)
    }else{
      showDialog({
        message: res.message,
      })
    }
  })
}
// 判断是否为空
function isEmpty (list: Array<any>) {
  return list.some(data => {  
    // 检查所有值是否都为空
    const allEmpty = Object.values(data).every(value => !value)
    if (allEmpty) {  
      return true // 终止循环  
    }  
    return false // 继续循环  
  })
}
// 点击单选框
function changeSelectInput(item: { id: string, props: { options: any } }) {
  let options = item.props.options
  currentKey.value = item.id
  options = options.map((op: any) => {
    return {
      text: op,
      value: op
    }
  })
  showSelectInputPicker.value = true
  selectInputOptions.value = options
}

// 单选确认值
function selectInputOnConfirm(val: { selectedOptions: { value: any }[] }) {
  showSelectInputPicker.value = false;
  const key = currentKey.value
  const newVal = val.selectedOptions[0].value
  handleProcessData(key, newVal)
}
function selectAjaxOnConfirm(val: { selectedOptions: { value: any }[] }) {
  showSelectAjaxPicker.value = false;
  const key = currentKey.value
  const newVal = val.selectedOptions
  handleProcessData(key, newVal)
}

// 改变多选框
function changeCheckbox(item: { id: string }, val: any[]) {
  const key = item.id
  const newVal = val
  handleProcessData(key, newVal)
}
function changeCheckboxAjax(val: any[]) {
  const key = showSearchAjaxItem.value?.id
  const newVal = val
  handleProcessData(key, newVal)
}

// 点击日期
function changeSingleDate(item: { id: string }) {
  currentKey.value = item.id
  // showSingleTime.value = true
  showPickerDataTime.value = true

}
// 单个日期确认
function singlDateOnConfirm(val: string | number | Date | dayjs.Dayjs | null | undefined) {
  showSingleTime.value = false
  const key = currentKey.value
  const newVal = dayjs(val).format('YYYY-MM-DD')
  handleProcessData(key, newVal)
}

// 点击日期范围
function changeDateRange(item: {
id: string, value: (string|number|Date)[] 
}) {
  currentKey.value = item.id
  const startTime: Date = new Date()
  const endTime: Date = new Date()
  defaultDate.arr = [startTime, endTime] // 设置默认值无效 待排查
  showGroupTime.value = true
}

// 组合时间确认
function groupTimeOnConfirm(val: (string | number | Date | dayjs.Dayjs | null | undefined)[]) {
  showGroupTime.value = false
  const key = currentKey.value
  const startTime = dayjs(val[0]).format('YYYY-MM-DD')
  const endTime = dayjs(val[1]).format('YYYY-MM-DD')
  const newVal = [startTime, endTime]
  handleProcessData(key, newVal)
}

// 图片预览
function previewImage(list: any[], index: number) {
  let arr = []
  if(typeof list[0] === 'string') {
    arr = list
  } else {
    for (const item of list) {
      arr.push(item.fileUrl)
    }
  }
  showImagePreview({
    images: arr,
    startPosition: index,
    closeable: true
  });
}

interface UploadResult {
  fileName: string;
  url: string;
}
interface FileResult {
  fileUrl: string;
  originFile: string;
}
// 上传图片
function afterReadImg(files:any, item: {
  value: never[], id: any 
}) {
  loading.value = true
  const key = item.id
  let newVal:any = item.value || []
  if (Array.isArray(files)) {
    for (let i = 0; i < files.length; i++) {
      loading.value = true
      ossUploadFile({ appModuleCode: 'flowSend', file: files[i].file }).then((res: unknown) => {
        const { fileName, url } = res as UploadResult
        getFileUrlV2({
          objectName: url
        }).then((result: unknown) => {
          const { fileUrl, originFile } = result as FileResult
          newVal = newVal.concat({url: url, name: fileName, fileUrl})
          loading.value = false
          handleProcessData(key, newVal)
        })
      })
    }
  } else {
    ossUploadFile({ appModuleCode: 'flowSend', file: files.file }).then((res: unknown) => {
      const { fileName, url } = res as UploadResult
      getFileUrlV2({
        objectName: url
        }).then((result: unknown) => {
        const { fileUrl, originFile } = result as FileResult
        loading.value = false
        newVal = newVal.concat({url: url, name: fileName, fileUrl})
        handleProcessData(key, newVal)
      })
    })
  }
  
}

// 删除图片
function deleteImg(index: any, item: { id: any; value: any[] }) {
  const key = item.id
  let newVal = item.value
  newVal.splice(index, 1)
  handleProcessData(key, newVal)
}

// 上传附件
function afterReadFile(files:any, item: { id: any; value: never[] }) {
  loading.value = true
  const key = item.id
  let newVal:any = item.value || []
  if (Array.isArray(files)) {
    for (let i = 0; i < files.length; i++) {
      loading.value = true
      // ossUploadFile({ appModuleCode: 'flowSend', file: files[i].file }).then((res: unknown) => {
      cloudOssUpload(files[i].file, 'flowSend').then((res: unknown) => {
        const { fileName, url } = res as UploadResult
        newVal = newVal.concat({url: url, name: fileName})
        loading.value = false
        handleProcessData(key, newVal)
      })
    }
  } else {
    // ossUploadFile({ appModuleCode: 'flowSend', file: files.file }).then((res: unknown) => {
    cloudOssUpload(files.file, 'flowSend').then((res: unknown) => {
      const { fileName, url } = res as UploadResult
      loading.value = false
      newVal = newVal.concat({url: url, name: fileName})
      handleProcessData(key, newVal)
    })
  }

}

// 删除附件
function deleteFile(index: any, item: { id: any; value: any[] }) {
  const key = item.id
  let newVal = item.value
  newVal.splice(index, 1)
  handleProcessData(key, newVal)
}

// 打开附件
function previewFile(item: { url: string }) {
  if (item.url.indexOf('internalres.joyoung.com') !== -1 || item.url.indexOf('internalres-test.joyoung.com') !== -1) {
    getFileUrlV2({
      objectName: item.url 
    }).then((result: unknown) => {
      const { fileUrl, originFile } = result as FileResult
      window.location.href = fileUrl
    })
  } else {
    window.location.href = item.url
  }
}

// 人员选择确认
function selectPersonBtnSubmit() {
  showSelect.value = false
  const key = currentKey.value
  const newVal = userList.arr
  handleProcessData(key, newVal)
}

// table标题弹窗提示
function showTableInfo (content: any) {
  showDialog({
    title: '提示',
    message: content || '',
    confirmButtonColor: '#FF7515'
  })
}
// 增加table
function addTable (item: {
  props: {columns: Array<any>},
  value: Array<any>
}) {
  const obj: any = {}
  item.props.columns.forEach((col: {field: string}) => {
    obj[col.field + ''] = ''
  })
  item.value.push(obj)
}
function delTable (item: {
  value: Array<any>
}, index: any) {
  item.value.splice(index, 1)
}

function returnWork() {
  router.go(-1)
}
</script>

<style lang="less" scoped>
.page{
  min-height: calc(100vh - 170px);
  background: #fff !important;
}
.topTip{
  color: red;
  font-size: 28px;
  margin-right: 5px;
}
.flex-left{
  display: flex;
  justify-content: left;
  align-items: center;
  .flex-content{
    overflow: hidden;
    font-size: 30px;
    color: #333333;
    line-height: 42px;
  }
}
.copy-title{
    font-weight: 500;
    font-size: 24px;
    color: #868686;
    line-height: 44px;
    padding-bottom: 20px;
}
.copy-icon{
    display: inline-block;
    width: 5px;
    height: 22px;
    background: linear-gradient( 180deg, #F78500 0%, #EB6100 100%);
    margin-right: 10px;
  }
.page{
  overflow: hidden;
  background: #fff;
  padding-bottom: 158px;
  .operation-group{
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    display: flex;
    justify-content: space-around;
    background: #fff;
    .operation-item{
      width: 188px;
      height: 136px;
      text-align: center;
      font-size: 28px;
      color: #333333;
      line-height: 30px;
      img{
        display: block;
        width: 56px;
        height: 56px;
        margin: 20px auto 0 auto;
      }
    }
  }
  .process-detail-padding{
    padding-bottom: 20px;
  }
  .process-detail{
    padding: 12px 0 0;
    background: #fff;
    .padding-32{
      padding: 0 32px;
    }
    .process-title{
      font-size: 32px;
      color: #333;
      line-height: 44px;
      font-weight: 600;
    }
    .process-item{
      padding-top: 20px;
      .box-title{
        font-weight: 600;
        font-size: 32px;
        color: #333333;
        line-height: 44px;
        span{
          display: inline-block;
          width: 5px;
          height: 22px;
          background: linear-gradient( 180deg, #F78500 0%, #EB6100 100%);
          margin-right: 20px;
        }
      }
      .flex-Box{
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .process-label-title{
        font-size: 28px;
        color: #999;
        line-height: 40px;
        padding-bottom: 10px;
        font-weight: 600;
      }
      .process-label-content{
        overflow: hidden;
        font-size: 30px;
        color: #333333;
        line-height: 42px;
        padding-bottom: 20px;
        .img-list{
          position:relative;
          float: left;
          :deep(.van-icon-clear){
            position: absolute;
            right: 8px;
            top:8px;
            color: rgba(0, 0, 0, 0.7)
          }
          margin-right: 10px;
        }
        .process-label-img{
          width: 160px;
          height: 160px;
        }
        :deep(.van-uploader__upload) {
          width: 160px;
          height: 160px;
        }
        :deep(.van-uploader__preview-delete--shadow){
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          border-radius: 28px;
        }
        .process-label-file{
          display: flex;
          justify-content: left;
          align-items: center;
          font-size: 28px;
          color: #333333;
          line-height: 40px;
          margin-bottom: 20px;
          :deep(.van-icon-link-o) {
            font-size: 30px;
            color: #FF7515
          }
          span{
            max-width: 640px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            padding: 0 20px 0 12px;
          }
        }
        .process-label-user{
          font-size: 30px;
          color: #333333;
          line-height: 42px;
          padding-bottom: 20px;
          span{
            padding-right:10px;
          }
        }
      }
      .van-divider {
        margin: 0;
      }
      .process-filed-bg .van-field{
        font-size: 28px;
        color: #333;
        line-height: 40px;
        padding: 16px;
        background: #F7F8FA;
        border-radius: 16px;
      }
      .van-checkbox{
        width: 100%;
        padding: 15px 0;
        font-size: 30px;
        color: #323233;
        line-height: 40px;
      }
      .process-filed-checkbox{
        .van-field{
          padding: 0;
          .van-checkbox-group{
            width: 100%;
            .van-checkbox {
              border-bottom: 1px solid #EBEDF0;
              margin-right: 0;
            }
          }
        }
      }
      .calendar-date{
        .van-field{
          border-radius: 72px;
        }
      }
      .calendar-group{
        width: 686px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .van-field{
          width: 318px;
          height: 72px;
          border-radius: 72px;
        }
      }
    }
  }
  .progress-box{
    max-height: 600px;
    overflow-y: auto;
    background: #fff;
    margin-top:20px;
    padding: 32px;
    .process-title{
      font-size: 32px;
      color: #333;
      line-height: 44px;
      font-weight: 600;
    }
    .title-opinion-user{
      display: flex;
      justify-content: space-between;
      font-weight: 600;
      font-size: 28px;
      color: #323233;
      line-height: 40px;
      .status-tip-box{
        width: 124px;
        height: 40px;
        font-size: 24px;
        line-height: 40px;
        text-align: center;
        border-radius: 20px;
      }
      .tip-success{
        color: #008907;
        background: rgba(0, 137, 7, 0.1);
      }
      .tip-error{
        color: #FE4040;
        background: rgba(254, 64, 64, 0.1)
      }
      .tip-warning{
        color: #FF7515;
        background: rgba(255, 117, 21, 0.1)
      }
    }
    .title-opinion-time{
      font-size: 24px;
      color: #646566;
      line-height: 32px;
      padding: 10px 0;
    }
    .title-opinion-content{
      font-size: 28px;
      color: #666666;
      line-height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;

    }
    :deep(.van-step__circle){
      background: #DCDEE0;
      width: 16px;
      height: 16px;
    }
    :deep(.van-step--vertical){
      padding: 20px 0;
    }
    :deep(.van-icon-checked:before){
      font-size: 36px;
    }
    :deep(.van-icon-checked){
      color: #FF7515;
    } 
   
  }
}
:deep(.van-ellipsis){
  overflow: initial
}
:deep(.van-picker__confirm){
  color: #FF7515;
}
:deep(.van-calendar__day){
  color: rgba(39, 38, 38, 0.7)
}
.process-popup-checkbox{
  flex: 1;
  padding: 20px 32px;
  // height: 360px; 
  font-size: 30px;
  overflow-y: scroll;
  .van-checkbox-group{
    // display: flex;
    // flex-wrap: wrap;
    // width: 100%;
    .van-checkbox {
      // width: 100%;
      // margin-right: 20px;
      // margin-bottom: 20px;
      // border-bottom: 1px solid #EBEDF0;
    }
  }
  .van-cell-group--inset{
    margin: 0;
    width: 100%;
  }
}
.option-box{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 750px;
  height: 626px;
  background: #FFFFFF;
  border-radius: 40px 40px 0px 0px;
  :deep(.van-icon-cross){
    position: absolute;
    top: 26px;
    right: 32px;
    font-size: 44px;
    color: #C8C9CC;
  }
  .title{
    font-weight: 600;
    text-align: center;
    font-size: 32px;
    color: #323233;
    line-height: 44px;
    padding: 26px 0;
  }
  .content{
    padding: 40px 32px 60px 32px;
    :deep(.van-field){
      background: #F7F8FA;
      border-radius: 16px;
    }
  }
}
// table
.table-box-border{
  border-bottom: 20px solid #F5F5F5;
}
.table-box-padding-bottom{
  padding-bottom: 20px;
}
.table-box{
  background: #FFF;
  .table-title{
    padding: 32px 0 24px 32px;
    font-weight: 500;
    font-size: 28px;
    color: #999999;
    background: #F5F5F5;
  }
  .table-content{
    padding: 0 33px;
    .table-con-box{
      padding-bottom: 20px;
    }
    .table-con-box+.table-con-box{
      // margin-top: 20px;
      border-top: 1px solid #E7E7E7;
    }
    .table-con-title{
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      padding-top: 20px;
      font-weight: 500;
      font-size: 28px;
      color: #999999;
      .van-icon-delete-o{
        font-size: 36px;
        color: #FF7515;
      }
    }
    .table-filed{
      display: flex;
      align-items: baseline;
      margin-top: 16px;
      .table-filed-title{
        margin-right: 16px;
        width: 168px;
        font-weight: 500;
        font-size: 28px;
        line-height: 40px;
        color: #999999;
      }
      .table-filed-value{ 
        flex: 1;
        .van-field{
          font-size: 28px;
          color: #333;
          line-height: 40px;
          padding: 16px;
          background: #F7F8FA;
          border-radius: 16px;
        }
      }
    }
  }
  .table-add{
    padding: 24px 0;
    text-align: center;
    font-weight: 500;
    font-size: 32px;
    color: #FF7515;
    // border-top: 1px solid #E7E7E7;
    .van-icon-plus{
      margin-right: 18px;
    }
  }
}
.getUp-Box{
  height: 100px;
}
.btn-group {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  height: 120px;
  padding: 16px 32px 0 32px;
  box-shadow: 0px 0px 10px 0px rgba(89,58,0,0.1);
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #FFF;
  .btn{
    width: 330px;
    height: 88px;
    border-radius: 44px;
    font-size: 34px;
    text-align: center;
    line-height: 88px;
    cursor: pointer;
  }
  .btn-default{
    color: #171A1D;
    background: #fff;
    border: 1px solid #7E868E;
    margin-right: 24px;
  }
  .btn-primary{
    color: #fff;
    background: #FF7515;
    border: 1px solid #FF7515;
  }
}
.upload-file-btn{
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  color: #FF7515;
  line-height: 48px;
  width: 180px;
  height: 56px;
  background: #F7F8FA;
  border-radius: 8px;
  text-align: center;
}
.border-btn{
  font-size: 26px;
  color: #FF7515;
  line-height: 48px;
  width: 137px;
  height: 48px;
  border-radius: 24px;
  border: 1px solid #FF7515;
  box-sizing: border-box;
  text-align: center;
  &:hover {
    cursor: pointer;
  }
}
.select-person-box{
  position: fixed;
  height: 100%;
  z-index: 100;
  top: 0;
  left: 0;
  background: #F5F5F5;
  .add-people-box{
    padding: 32px 32px 0 32px;
    background: #fff;
    .box-title{
      font-weight: 600;
      font-size: 32px;
      color: #333333;
      line-height: 44px;
      padding-bottom: 20px;
      span{
        display: inline-block;
        width: 5px;
        height: 22px;
        background: linear-gradient( 180deg, #F78500 0%, #EB6100 100%);
        margin-right: 20px;
      }
    }
  }
  .filter-box{
    margin-bottom: 160px;
    height: 100%;
  }
  .box-content{
    display: flex;
    flex-wrap: wrap;
    .box-content-item{
      display: flex;
      font-size: 28px;
      color: #333333;
      padding: 8px 14px;
      border-radius: 28px;
      background: #F7F8FA;
      margin:10px 20px 10px 0;
      align-items: center;
      img{
        width: 28px;
        height: 28px;
        margin-left: 8px;
      }
    }
    .box-no-data{
      width: 100%
    }
  }
  .btn-group {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    height: 120px;
    box-shadow: 0px 0px 10px 0px rgba(89,58,0,0.1);
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #FFF;
    z-index: 1000;
    .btn{
      width: 330px;
      height: 88px;
      border-radius: 44px;
      font-size: 34px;
      text-align: center;
      line-height: 88px;
      cursor: pointer;
    }
    .btn-default{
      color: #171A1D;
      background: #fff;
      border: 1px solid #7E868E;
      margin-right: 24px;
    }
    .btn-primary{
      color: #fff;
      background: #FF7515;
      border: 1px solid #FF7515;
    }
  }
}
.loading-box{
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000
}
.pts-box-item{
  padding-top: 15px;
}
.part-code-desc{
  font-size: 28px;
  color: #999;
  min-height: 52px;
  line-height:52px;
  padding: 10px;
  margin-top: 15px;
  background: #F7F8FA;
  border-radius: 16px;
}
// 接口弹窗标题
.ajax-popup-title{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88px;
  text-align: center;
  color: #333;
  font-weight: 600;
  font-size: 32px;
}
.van-popup{
  .van-search{
    padding: 0 24px;
  }
}
</style>