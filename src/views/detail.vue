<template>
  <div class="page">
    <!--头部操作按钮组-->
    <div class="operation-group">
      <div :class="['operation-item',showBtn ? '' : 'unclick', 'operation-item-agree' ]" @click="btnAgree">
        <img src="https://res.joyoung.com/07/01/icon_agree_process_2.png" alt="同意"/>
        <span>同意</span>
      </div>
      <div :class="['operation-item',showBtn ? '' : 'unclick', 'operation-item-refuse' ]" @click="btnRefuse">
        <img src="https://res.joyoung.com/07/01/icon_refuse_process_2.png" alt="拒绝"/>
        <span>拒绝</span>
      </div>
      <div :class="['operation-item',showBtn ? '' : 'unclick' ]" @click="transfer">
        <img src="https://res.joyoung.com/07/01/icon_transfer_2.png" alt="转办"/>
        <span>转办</span>
      </div>
      <div class="operation-item" @click="circulate">
        <img src="https://res.joyoung.com/07/01/icon_distribute_2.png" alt="分阅"/>
        <span>分阅</span>
      </div>
      <div v-if="isRevoke" :class="['operation-item',showBtn ? '' : 'unclick' ]" @click="btnRevoke">
        <img src="https://res.joyoung.com/07/01/icon_revoke_2.png" alt="撤回"/>
        <span>撤回</span>
      </div>
    </div>
    <!--流程工作台 操作记录-->
    <div class="operation-record" v-if="isPc">
      <div class="operation-record-item" @click="returnWork">
        <img src="https://res.joyoung.com/33/01/f414cfb8-e79d-4f11-932c-bab5c484ee0b-5c115fe6-1a07-4658-8346-338428042763.png" alt="工作台"/>
        工作台
      </div>
      <div class="operation-record-item middle" @click="jumpToAnchor('steps')">
        <img src="https://res.joyoung.com/33/01/f414cfb8-e79d-4f11-932c-bab5c484ee0b-f7c09fd6-240d-4ca0-af1f-ad1c4a9226e2.png" alt="操作记录"/>
        操作记录
      </div>
      <div class="operation-record-item" @click="goToPc">
        <img src="https://res.joyoung.com/33/01/f414cfb8-e79d-4f11-932c-bab5c484ee0b-af6c22b5-0127-4e4b-9810-316849613908.png" alt="PC操作"/>
        PC操作
      </div>
    </div>
    <div class="operation-record" v-if="!isPc">
      <div class="operation-record-item left" @click="returnWork">
        <img src="https://res.joyoung.com/33/01/f414cfb8-e79d-4f11-932c-bab5c484ee0b-5c115fe6-1a07-4658-8346-338428042763.png" alt="工作台"/>
        工作台
      </div>
      <div class="operation-record-item right" @click="jumpToAnchor('steps')">
        <img src="https://res.joyoung.com/33/01/f414cfb8-e79d-4f11-932c-bab5c484ee0b-f7c09fd6-240d-4ca0-af1f-ad1c4a9226e2.png" alt="操作记录"/>
        操作记录
      </div>
    </div>
    <!--流程详情区域-->
    <div class="process-detail" :key="updateKey">
      <template v-for="(item, index) in processDetail" :key="index">
        <div :class="{ 'padding-32': item.name !== 'Table' }">
          <!--固定标题-->
          <div class="box-title-icon" v-if="item.props.fixed && item.props.fieldFlag === 'title'"><span></span>{{item.value}}</div>
          <!--单文本-->
          <template v-if="item.name === 'TextInput' && !item.props.fixed">
            <template v-if="item.perm === 'E'">
              <div class="process-content-box">
                <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                <div class="process-filed-bg">
                  <van-field v-model="item.value" :maxlength="item.props.maxLength || 100" :placeholder="item.props.placeholder" />
                </div>
              </div>
            </template>
            <template v-else-if="item.perm === 'R' && item.value">
              <template v-if="item.props.linefeed">
                <div class="process-content-box">
                  <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                  <div class="process-label-content">{{item.value}}</div>
                </div>
              </template>
              <template v-else>
                <div class="process-content-box"><span v-if="item.props.required" class="topTip">*</span><span class="process-label">{{item.title}}</span>{{item.value}}</div>
              </template>
            </template>
          </template>
          <!--多行文本-->
          <template v-if="item.name === 'TextareaInput'">
            <template v-if="item.perm === 'E'">
              <div class="process-content-box">
                <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                <div class="process-filed-bg">
                  <van-field v-model="item.value" type="textarea" rows="3" :maxlength="item.props.maxLength || 1000" :placeholder="item.props.placeholder" />
                </div>
              </div>
            </template>
            <template v-else-if="item.perm === 'R' && item.value">
              <div class="process-content-box">
                <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                <van-field v-if="item.value" class="textarea-readonly-box" v-model="item.value" type="textarea" readonly autosize rows="1" />
              </div>
            </template>
          </template>
          <!--输入数字-->
          <template v-if="item.name === 'NumberInput'">
            <template v-if="item.perm === 'E'">
              <div class="process-content-box">
                <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                <div class="process-filed-bg">
                  <van-field v-model="item.value" type="digit" :placeholder="item.props.placeholder" />
                </div>
              </div>
            </template>
            <template v-else-if="item.perm === 'R' && item.value">
              <template v-if="item.props.linefeed">
                <div class="process-content-box">
                  <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                  <div class="process-label-content">{{item.value}}</div>
                </div>
              </template>
              <template v-else>
                <div class="process-content-box"><span v-if="item.props.required" class="topTip">*</span><span class="process-label">{{item.title}}</span>{{item.value}}</div>
              </template>
            </template>
          </template>
          <!--单选-->
          <template v-if="item.name === 'SelectInput'">
            <template v-if="item.perm === 'E'">
              <div class="process-content-box">
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
              </div>
            </template>
            <template v-else-if="item.perm === 'R' && item.value">
              <template v-if="item.props.linefeed">
                <div class="process-content-box">
                  <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                  <div class="process-label-content">{{item.value}}</div>
                </div>
              </template>
              <template v-else>
                <div class="process-content-box"><span v-if="item.props.required" class="topTip">*</span><span class="process-label">{{item.title}}</span>{{item.value}}</div>
              </template>
            </template>
          </template>
          <!--多选-->
          <template v-if="item.name === 'MultipleSelect'">
            <template v-if="item.perm === 'E'">
              <div class="process-content-box">
                <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                <div class="process-filed-checkbox">
                  <van-checkbox-group v-model="item.value" checked-color="#FF7515" direction="horizontal" @change="changeCheckbox(item, $event)">
                    <van-checkbox v-for="checkItem in item.props.options" :key="checkItem" :name="checkItem" shape="square">{{checkItem}}</van-checkbox>
                  </van-checkbox-group>
                </div>
              </div>
            </template>
            <template v-else-if="item.perm === 'R' && item.value.length > 0">
              <template v-if="item.props.linefeed">
                <div class="process-content-box">
                  <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                  <div class="process-label-content"><span v-for="(contItem, index) in item.value" :key="index">{{contItem + ' '}}</span></div>
                </div>
              </template>
              <template v-else>
                <div class="process-content-box"><span v-if="item.props.required" class="topTip">*</span><span class="process-label">{{item.title}}</span><span v-for="(contItem, index) in item.value" :key="index">{{contItem + ' '}}</span></div>
              </template>
            </template>
          </template>
          <!--日期-->
          <template v-if="item.name === 'DateTime'">
            <template v-if="item.perm === 'E'">
              <div class="process-content-box">
                <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                <div class="process-filed-bg calendar-date" @click="changeSingleDate(item)">
                  <van-field
                    v-model="item.value"
                    readonly
                    left-icon="notes-o"
                    placeholder="选择日期"
                  />
                </div>
              </div>
            </template>
            <template v-else-if="item.perm === 'R' && item.value">
              <template v-if="item.props.linefeed">
                <div class="process-content-box">
                  <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                  <div class="process-label-content">{{item.value}}</div>
                </div>
              </template>
              <template v-else>
                <div class="process-content-box"><span v-if="item.props.required" class="topTip">*</span><span class="process-label">{{item.title}}</span>{{item.value}}</div>
              </template>
            </template>
          </template>
          <!--日期范围-->
          <template v-if="item.name === 'DateTimeRange'">
            <template v-if="item.perm === 'E'">
              <div class="process-content-box">
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
              </div>
            </template>
            <template v-else-if="item.perm === 'R' && item.value.length > 0">
              <template v-if="item.props.linefeed">
                <div class="process-content-box">
                  <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                  <div class="process-label-content" v-if="item.value && item.value.length">{{`${item.value[0]} ~ ${item.value[1]}`}}</div>
                </div>
              </template>
              <template v-else>
                <div class="process-content-box"><span v-if="item.props.required" class="topTip">*</span><span class="process-label">{{item.title}}</span><template v-if="item.value && item.value.length">{{`${item.value[0]} ~ ${item.value[1]}`}}</template></div>
              </template>
            </template>
          </template>
          <!--上传图片-->
          <template v-if="item.name === 'ImageUpload'">
            <template v-if="item.perm === 'E'">
              <div class="process-content-box">
                <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                <div class="process-label-content">
                  <div class="img-list" :key="index" v-for="(imgItem, index) in item.value" @click="previewImage(item.value, index)">
                    <van-icon name="clear" @click.stop="deleteImg(index, item)"/>
                    <img class="process-label-img" :src="imgItem.fileUrl" alt="process"/>
                  </div>
                  <van-uploader v-if="item.value.length < item.props.maxNumber" multiple :after-read="(file)=>afterReadImg(file, item)"/>
                </div>
              </div>
            </template>
            <template v-else-if="item.perm === 'R' && item.value.length > 0">
              <template v-if="item.props.linefeed">
                <div class="process-content-box diplay-block">
                  <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                  <div class="process-label-content">
                    <div class="img-list" :key="index" v-for="(imgItem, index) in item.value" @click="previewImage(item.value, index)">
                      <img class="process-label-img" :src="imgItem.fileUrl"  alt="process"/>
                    </div>
                  </div>
                  <div class="process-label-tips">注：{{item.props.placeholder}}</div>
                </div>
              </template>
              <template v-else>
                <div class="process-content-box diplay-block">
                  <div class="process-label"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                  <div class="process-label-content">
                    <div class="img-list" :key="index" v-for="(imgItem, index) in item.value" @click="previewImage(item.value, index)">
                      <img class="process-label-img" :src="imgItem.fileUrl"  alt="process"/>
                    </div>
                  </div>
                  <div class="process-label-tips">注：{{item.props.placeholder}}</div>
                </div>
              </template>
            </template>
          </template>
          <!--上传文件-->
          <template v-if="item.name === 'FileUpload'">
            <template v-if="item.perm === 'E'">
              <div class="process-content-box">
                <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                <div class="process-label-content">
                  <div class="upload-file-box" :key="index" v-for="(fileItem, index) in item.value" @click="previewFile(fileItem)">
                    <van-icon name="description-o" /><span>{{fileItem.name}}</span><van-icon name="clear" @click.stop="deleteFile(index, item)"/>
                  </div>
                  <van-uploader multiple v-if="item.value.length < item.props.maxNumber" :accept="acceptType" :after-read="(file) => afterReadFile(file, item)">
                    <div class="upload-file-btn"><van-icon name="description-o" />上传附件</div>
                  </van-uploader>
                </div>
              </div>
            </template>
            <template v-else-if="item.perm === 'R' && item.value.length > 0">
              <div class="process-content-box diplay-block">
                <div class="process-label"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                <div class="clear"></div>
                <div class="process-label-content">
                  <div class="upload-file-btn" :key="index" v-for="(fileItem, index) in item.value" @click="previewFile(fileItem)">
                    <van-icon name="description-o" /><span>{{decodeURIComponent(fileItem.name)}}</span>
                  </div>
                </div>
                <div class="process-label-tips">注：{{item.props.placeholder}}</div>
              </div>
            </template>
          </template>
          <!--下载文件-->
          <template v-if="item.name === 'FileDownload'">
            <div class="process-content-box">
              <div class="process-label">{{item.title}}</div>
              <div class="clear"></div>
              <div class="process-content">
                <div class="upload-file-btn" @click="previewFile(item.props)">
                  <van-icon name="link-o" /><span>下载文件</span>
                </div>
              </div>
              <div class="process-label-tips">注：{{item.props.placeholder}}</div>
            </div>
          </template>
          <!--人员选择-->
          <template v-if="item.name === 'UserPicker'">
            <template v-if="item.perm === 'E'">
              <div class="process-content-box">
                <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                <div class="process-label-content">
                  <div class="process-label-user"><span v-for="(contItem, index) in item.value" :key="index">{{contItem.name + ''}}</span></div>
                  <div class="border-btn" @click="choosePerson(item)">选择人员</div>
                </div>
              </div>
            </template>
            <template v-else-if="item.perm === 'R' && item.value.length > 0">
              <template v-if="item.props.linefeed">
                <div class="process-content-box">
                  <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                  <div class="process-label-content">
                    <div class="process-label-user"><span v-for="(contItem, index) in item.value" :key="index">{{contItem.name + ''}}</span></div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="process-content-box">
                  <span v-if="item.props.required" class="topTip">*</span>
                  <span class="process-label">{{item.title}}</span>
                  <template v-for="(contItem, index) in item.value" :key="contItem">
                    <!-- 用，分割，最后一个用句号 -->
                    <span> {{ contItem.name + (index === item.value.length - 1 ? '' : '，') }}</span>
                  </template>
                </div>
              </template>
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
              <div class="process-content-box">
                <div class="process-label"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                <van-field name="rate" label="评分" readonly>
                  <template #input>
                    <van-rate v-model="item.value" />
                  </template>
                </van-field>
              </div>
            </template>
          </template>
          <!--提示-->
          <template v-if="item.name === 'Description'">
            <template v-if="item.perm === 'E'">
              <div class="flex-Box">
                <van-icon name="info-o" size="24" color="#EB6100"/>
                <van-field
                  v-model="item.value"
                  :placeholder="item.props.placeholder"
                />
              </div>
            </template>
            <template v-else-if="item.perm === 'R' && item.value">
              <div class="copy-title">
                <van-icon name="info-o" color="#EB6100"/>
                {{item.value}}
              </div>
            </template>
          </template>
          <!--配件编码-->
          <template v-if="item.name === 'PartCode'">
            <template v-if="item.perm === 'E'">
              <div class="process-content-box">
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
                <div class="process-filed-bg">
                  <div class="part-code-desc">
                    {{Object.keys(item.value).length === 0 ? '自动带出配件名称' :item.value.label}}
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="item.perm === 'R' && item.value.value">
              <div class="process-content-box">
                <div class="process-label">{{item.title}}</div>
                <div class="clear"></div>
                <div class="process-label-content">{{item.value.value}}</div>
                <div class="process-label-content" v-if="item.value.label">{{item.value.label}}</div>
              </div>
            </template>
          </template>
          <!--产品线-->
          <template v-if="item.name === 'ProductLine'">
            <template v-if="item.perm === 'E'">
              <div class="process-content-box">
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
              </div>
            </template>
            <template v-else-if="item.perm === 'R' && item.value.label">
              <template v-if="item.props.linefeed">
                <div class="process-content-box">
                  <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                  <div class="process-label-content">{{item.value.label}}</div>
                </div>
              </template>
              <template v-else>
                <div class="process-content-box"><span class="process-label">{{item.title}}</span>{{item.value.label}}</div>
              </template>
            </template>
          </template>
          <!--产品型号-->
          <template v-if="item.name === 'ProductModel'">
            <template v-if="item.perm === 'E'">
              <div class="process-content-box">
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
              </div>
            </template>
            <template v-else-if="item.perm === 'R' && item.value.label">
               <template v-if="item.props.linefeed">
                <div class="process-content-box">
                  <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                  <div class="process-label-content">{{item.value.label}}</div>
                </div>
              </template>
              <template v-else>
                <div class="process-content-box"><span class="process-label">{{item.title}}</span>{{item.value.label}}</div>
              </template>
            </template>
          </template>
          <!--扫描-->
          <template v-if="item.name === 'PTSScan'">
            <template v-if="item.perm === 'E'">
              <div class="process-content-box">
                <div class="flex-Box">
                  <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                </div>
                <div class="process-filed-bg flex-Box">
                  <van-field v-model="item.code" :placeholder="item.props.placeholder" @click="selectPTS(item.id)"/>
                  <scan-qrcode style="width:40px;height:40px" @getScanCode="scanQrCode" />
                </div>
                <div class="process-filed-bg pts-box-item" v-if="item.lineName ==null">
                  <van-field
                  v-model="item.model"
                    is-link
                    readonly
                    name="picker"
                    @click="selectData(item.id,'modelGetPdt',{name: '',value: undefined,props: {multiple: false,remote: false}})"
                  />
                </div>
                <div class="process-filed-bg pts-box-item" v-else>
                  <van-field
                    v-model="item.model"
                    readonly
                    disabled
                  />
                </div>
                <div class="process-filed-bg pts-box-item">
                  <van-field
                    v-model="item.lineName"
                    readonly
                    disabled
                    placeholder="自动带出"
                  />
                </div>
              </div>
            </template>
            <template v-else-if="item.perm === 'R' && item.code">
              <div class="process-content-box">
                <div class="process-label-title"><span v-if="item.props.required" class="topTip">*</span>{{item.title}}</div>
                <div class="process-label-content">{{item.code}}</div>
                <div class="process-label-content">{{item.lineName}}</div>
                <div class="process-label-content">{{item.model}}</div>
              </div>
            </template>
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
                  <div v-if="item.perm === 'E'" class="table-con-title">
                    <div>表格明细({{ index + 1 }})</div>
                    <van-icon name="delete-o" @click="delTable(item, index)" />
                  </div>
                  <div v-else class="table-filed">
                    <div class="table-filed-title">序号</div>
                    <div class="table-filed-value">{{ index + 1 }}</div>
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
                      <div class="table-filed-value">{{val[col.field]}}</div>
                    </template>
                  </div>
                </div>
                <div v-if="item.perm === 'E'" class="table-add" @click="addTable(item)">
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
                <div class="process-label-content">{{ajaxSelectValue(item.value)}}</div>
              </template>
          </template>
          <!--跳转按钮-->
          <template v-if="item.name === 'JumpBtn'">
            <div class="process-content-box">
              <van-button type="primary" color="#ff7515" round size="small" @click="jumpToWechat(item)">{{item.props.btnName}}</van-button>
            </div>
          </template>
        </div>
      </template>
    </div>

    <!--单选弹出框-->
    <van-popup v-model:show="showSelectInputPicker" position="bottom">
      <van-picker
        :columns="selectInputOptions"
        @confirm="selectInputOnConfirm"
        @cancel="showSelectInputPicker = false"
      />
    </van-popup>
    <!--日历-->
    <van-calendar :style="{ height: '70%', width: bodyWidth + 'px', left:'50%', transform: `translateX(-50%)`}" v-model:show="showSingleTime" @confirm="singlDateOnConfirm" :min-date="minDate"  color="#FF7515"/>
    <!--日期范围 日历-->
    <van-calendar :style="{ height: '70%', width: bodyWidth + 'px', left:'50%', transform: `translateX(-50%)`}"  v-model:show="showGroupTime" :default-date="defaultDate.arr" :min-date="minDate" type="range" @confirm="groupTimeOnConfirm" color="#FF7515"/>
    <!-- 日期时间选择 -->
    <DataTime
      :values="dataTime"
      @changeValue="showPickerDataTime = false"
      :showPicker="showPickerDataTime"
      @confirm="onConfirmDataTime"
    />

    <!--操作记录区域-->
    <div class="progress-box" id="steps">
      <div class="process-title"><span></span>操作记录</div>
      <div class="steps">
        <template v-for="(node, index) in threeLevelTaskNode.arr" :key="index">
          <!--流程节点-->
          <div class="step-item step-item-group" v-if="node.groupName">
            <div class="step-dot-node"><div class="step-dot-center"></div></div>
            <div class="step-content">
              <div class="step-node-title">{{ node.groupName }}{{node.list[0] && node.list[0].nodeType === 'INIT' ? `：${node.list[0].assignee}` : ''}}</div>
            </div>
            <div v-if="index < threeLevelTaskNode.arr.length - 1 || node.list.length > 0" class="step-line-node"></div>
          </div>
          <!--操作节点-->
          <template v-if="threeLevelTaskNode.arr[index].list && node.list.length > 0">
            <div v-for="(opItem, opIndex) in node.list" :key="opIndex">
              <div v-if="opItem.assignee !== '无' && opItem.nodeType !== 'INIT' && !(!opItem.businessStatusName && opItem.endTime)" class="step-item">
                <!--拒绝-->
                <template v-if="opItem.nodeType === 'REJECTED'">
                  <div class="step-dot"></div>
                  <div class="step-content">
                    <div class="strp-content-lrlayout">
                      <div class="step-content-lrlayout-top flex-between">
                        <div class="step-option-2 step-option-refuse-2">拒绝</div>
                        <div class="flex-between flex-1">
                          <span class="step-text-assignee">{{opItem.assignee}}</span>
                          <div v-if="opItem.endTime" class="step-text-time">
                            <span v-for="(num, index) in String(opItem.endTime).split(' ')" :key="index">{{ index === String(opItem.endTime).split(' ').length -1 ? num.substring(0, 5) : num }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="step-content-lrlayout-bottom">
                        <div class="step-text-content-gray" v-if="opItem.message || opItem.attachmentList && opItem.attachmentList.length > 0">
                          <div class="title-opinion-content" v-if="opItem.message">
                            <van-text-ellipsis rows="2" :content="opItem.message" expand-text="展开" collapse-text="收起" />
                          </div>
                          <div class="options-file-content" v-if="opItem.attachmentList && opItem.attachmentList.length > 0">
                            <div class="options-upload-file" :key="index" v-for="(fileItem, index) in opItem.attachmentList" @click="previewFile(fileItem)">
                              <van-icon name="description-o" /><span>{{fileItem.name}}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="opIndex === node.list.length - 1" class="step-item-divider"></div>
                  </div>
                </template>
                <!--撤回-->
                <template v-if="opItem.nodeType === 'REMOVE'">
                  <div class="step-dot"></div>
                  <div class="step-content">
                    <div class="strp-content-lrlayout">
                      <div class="step-content-lrlayout-top flex-between">
                        <div class="step-option-2 step-option-refuse-2">撤回</div>
                        <div class="flex-between flex-1">
                          <span class="step-text-assignee">{{opItem.assignee}}</span>
                          <div v-if="opItem.endTime" class="step-text-time">
                            <span v-for="(num, index) in String(opItem.endTime).split(' ')" :key="index">{{ index === String(opItem.endTime).split(' ').length -1 ? num.substring(0, 5) : num }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="step-content-lrlayout-bottom">
                        <div class="step-text-content-gray" v-if="opItem.message || opItem.attachmentList && opItem.attachmentList.length > 0">
                          <div class="title-opinion-content" v-if="opItem.message">
                            <van-text-ellipsis rows="2" :content="opItem.message" expand-text="展开" collapse-text="收起" />
                          </div>
                          <div class="options-file-content" v-if="opItem.attachmentList && opItem.attachmentList.length > 0">
                            <div class="options-upload-file" :key="index" v-for="(fileItem, index) in opItem.attachmentList" @click="previewFile(fileItem)">
                              <van-icon name="description-o" /><span>{{fileItem.name}}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="opIndex === node.list.length - 1" class="step-item-divider"></div>
                  </div>
                </template>
                <!--同意-->
                <template v-else-if="opItem.nodeType === 'APPROVED'">
                  <div class="step-dot"></div>
                  <div class="step-content">
                    <div class="strp-content-lrlayout">
                      <div class="step-content-lrlayout-top flex-between">
                        <div class="step-option-2 step-option-success-2">同意</div>
                        <div class="flex-between flex-1">
                          <span class="step-text-assignee">{{opItem.assignee}}</span>
                          <div v-if="opItem.endTime" class="step-text-time">
                            <span v-for="(num, index) in String(opItem.endTime).split(' ')" :key="index">{{ index === String(opItem.endTime).split(' ').length -1 ? num.substring(0, 5) : num }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="step-content-lrlayout-bottom">
                        <div class="step-text-content-gray" v-if="opItem.message || opItem.attachmentList && opItem.attachmentList.length > 0">
                          <div class="title-opinion-content" v-if="opItem.message">
                            <van-text-ellipsis rows="2" :content="opItem.message" expand-text="展开" collapse-text="收起" />
                          </div>
                          <div class="options-file-content" v-if="opItem.attachmentList && opItem.attachmentList.length > 0">
                            <div class="options-upload-file" :key="index" v-for="(fileItem, index) in opItem.attachmentList" @click="previewFile(fileItem)">
                              <van-icon name="description-o" /><span>{{fileItem.name}}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="opIndex === node.list.length - 1" class="step-item-divider"></div>
                  </div>
                </template>
                <!--转办 分阅  自动流转-->
                <template v-else-if="['TRANSFERRED', 'SHARED', 'AUTO_TASK', 'AddComment'].includes(opItem.nodeType)">
                  <div class="step-dot"></div>
                  <div class="step-content">
                    <div class="strp-content-lrlayout">
                      <div class="step-content-lrlayout-top flex-between">
                        <div class="step-option-2 step-option-parmary-2">{{opItem.businessStatusName || '自动通过'}}</div>
                        <div class="flex-between flex-1">
                          <span class="step-text-assignee">{{opItem.assignee}}</span>
                          <div v-if="opItem.endTime" class="step-text-time">
                            <span v-for="(num, index) in String(opItem.endTime).split(' ')" :key="index">{{ index === String(opItem.endTime).split(' ').length -1 ? num.substring(0, 5) : num }}</span>
                          </div>
                        </div>
                      </div>
                      <div v-if="opItem.message !== '自动通过'" class="step-content-lrlayout-bottom">
                        <div class="step-text-gray">{{opItem.message}}</div>
                      </div>
                    </div>
                    <div v-if="opIndex === node.list.length - 1" class="step-item-divider"></div>
                  </div>
                </template>
                <!--发起-->
                <!-- <template v-else-if="opItem.nodeType === 'INIT'">
                  <div class="step-dot"></div>
                  <div class="step-content">
                    <div class="step-options-content">
                      <div class="step-content-left ">
                        <span class="step-color-default">{{opItem.assignee}}11</span>
                      </div>
                      <div v-if="opItem.endTime" class="step-color-time">
                        <span v-for="(num, index) in String(opItem.endTime).split(' ')" :key="index">{{ num }}</span>
                      </div>
                    </div>
                  </div>
                </template> -->
                <!--进行中-->
                <template v-else-if="opItem.nodeType === 'CURRENT'">
                  <div class="step-dot-default"></div>
                  <div class="step-content">
                    <div class="strp-content-lrlayout">
                      <div class="step-content-lrlayout-top flex-between">
                        <div class="step-option-2 step-option-current">待办</div>
                        <div class="flex-between flex-1">
                          <span class="step-text-assignee">{{opItem.assignee}}</span>
                          <div v-if="opItem.endTime" class="step-text-time">
                            <span v-for="(num, index) in String(opItem.endTime).split(' ')" :key="index">{{ index === String(opItem.endTime).split(' ').length -1 ? num.substring(0, 5) : num }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else-if="opItem.nodeType === 'FOLD'">
                  <div class="step-dot"></div>
                  <div class="step-content" @click="activeFlod">
                    <div class="step-options-content">
                      <div class="step-content-left ">
                        <span class="step-color-parmary">
                          {{ opItem.flodTitle }}
                          <van-icon :name="processFold ? 'arrow-up' : 'arrow-down'" />
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
                <div class="step-line-default" v-if="opIndex === node.list.length - 2 && node.list[opIndex+1].nodeType === 'CURRENT'"></div>
                <div class="step-line-none" v-else-if="index === threeLevelTaskNode.arr.length -1 && opIndex === node.list.length - 1"></div>
                <div v-else class="step-line"></div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
  <!--操作弹框-->
  <van-overlay :show="openDialog" @click="openDialog = false" z-index="1000" class-name="default-overlay">
    <div class="option-box" @click.stop>
      <van-icon name="cross" @click="openDialog = false"/>
      <div class="title">审批：{{approvelTypeList[approvelType]}}</div>
      <div class="option-content-box">
        <div class="box-title-icon"><span></span>操作记录</div>
        <div class="content">
          <van-field
            v-model="approvel"
            rows="4"
            type="textarea"
            maxlength="800"
            placeholder="请输入审批意见"
            show-word-limit
          />
        </div>
        <template v-if="approvelType !== 'revoke'">
          <div class="box-title-icon"><span></span>上传附件（最多上传3个附件）</div>
          <div class="box-upload-file">
            <div class="upload-file-box" v-for="(item, index) in optionsFileList.arr" :key="index">
              <van-icon name="description-o" /><span>{{item.name}}</span><van-icon name="clear" @click="optionsDeleteFile(index)"/>
            </div>
            <van-uploader multiple :max-count="3" :accept="acceptType" :after-read="(file) => optionsUploadFile(file)">
              <div class="upload-file-btn"><van-icon name="description-o" />上传附件</div>
            </van-uploader>
          </div>
        </template>
      </div>
      <div class="btn-box">
        <div class="btn btn-default" @click="openDialog = false">取消</div>
        <div class="btn btn-primary" @click="confirmApprovel">确认</div>
      </div>
    </div>
  </van-overlay>
  <!--页面加载中-->
  <van-overlay :show="loading" @click="loading = false" class="loading-box" class-name="default-overlay">
    <van-loading />
  </van-overlay>
  <!--人员选择-->
  <van-overlay :show="showSelect" z-index="1000" class-name="default-overlay">
    <div class="select-person-box">
      <div class="add-people-box">
        <div class="box-title-icon"><span></span>添加人员</div>
        <div class="box-content">
          <div class="box-no-data" v-if="!userList.arr.length">
            <noDataDefault :message="'暂未选择人员'"/>
          </div>
          <div class="box-content-item" v-for="(item, index) in userList.arr" :key="index">
            <span>{{item.name}}</span>
            <img src="https://res.joyoung.com/07/01/icon_reduce.png" @click="deleteUser(index, userList.arr)" alt="删除"/>
          </div>
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
  <!--型号&产品线弹窗-->
  <van-popup v-model:show="showSearch" round position="bottom" :style="{ height: '50%'}" >
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
      <!-- <van-checkbox-group v-model="selectInputOptionsMultiple" checked-color="#FF7515" direction="horizontal" @change="changeCheckboxAjax($event)">
        <van-checkbox v-for="checkItem in selectInputOptions" :key="checkItem" :name="checkItem" shape="square">{{(checkItem as any).text}}</van-checkbox>
      </van-checkbox-group> -->
    </div>
    <!-- <div class="btn-group">
      <div class="btn btn-default" @click="showSearchAjaxMultiple = false">
        取消
      </div>
      <div class="btn btn-primary" @click="selectPersonBtnSubmit">
        确认
      </div>
    </div> -->
  </van-popup>
</template>

<script setup lang="ts">
// components: {
//   scanQrcode
// }
import { mixinPostJssdk, openDefaultBrowser } from '../utils/utils'

import DataTime from '@/components/datatime.vue'
import router from '@/router'
import dayjs from 'dayjs'
import { showImagePreview, showSuccessToast,showDialog, showToast } from 'vant'
import { reactive, ref, onActivated } from 'vue'
import { useRoute } from 'vue-router'
import OSS from 'ali-oss'
import { ossUploadFile, getFileUrlV2, cloudOssUpload } from '@/utils/oss'
import { getDetail, getProcess, handleAgree, handleRefuse, handleRevoke } from '@/api/home'
import { getProductLine,getParts,getModel,getPtsCode,getAjaxData } from '@/api/createProcess'
import { uploadFileToOss } from '@/api/common'
import filterTree from '@/component/filterTree.vue'
import scanQrcode from '@/components/scan-qrcode.vue'
import noDataDefault from '@/component/noDataDefault.vue'
const bodyWidth = ref(document.body.clientWidth)
let showSearch = ref(false) // 通用弹窗
let isProductLine = ref(false) // 是否是产品线
let keepId = ref('')
let dialogType = ref('')
let ptsCode:any = ref({}) //pts码
let keyword = ref('')
let isPc = ref(false)
// 产品线/型号
const columns:any = ref([]) 
// 暂存产品线
let processDefinitionId = ''
const route = useRoute()
const updateKey = ref(0)
const child = ref()
const processDetail:any = ref({}) // 流程详情
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

const ajaxSelectValue = ((val: any[])=>{  
  return val.map((item: any) => {
    return item.text
  }).join('，')
})

const currentKey = ref('') // 当前操作的key
const showSingleTime = ref(false)
const showGroupTime = ref(false) // 显示组合时间
const defaultDate = reactive({
  arr:[] as any[]
})
// minDate设置为15年前
const minDate = new Date(new Date().getFullYear() - 15, new Date().getMonth(), new Date().getDate())
const dataTime = ref(""); // 日期时间选择值定义
const showPickerDataTime = ref(false); // 日期时间选择弹框显隐
const onConfirmDataTime = (val: string | number | Date | dayjs.Dayjs | null | undefined) => {
  showPickerDataTime.value = false
  const key = currentKey.value
  const newVal = val
  handleProcessData(key, newVal)
}

const processArr = ref([])
const loading = ref(false)
let processInstanceId = ''
let taskId = ''
let assignee = ''
let isRevoke = false
let formItems: any[] = []
const userId = localStorage.getItem('userInfo.userId')
let formPerms: { id: any; perm: any }[] = []
// 操作审批
const openDialog = ref(false)
const approvel = ref() // 审批意见
let processFormData:any = {}
let approvelType = ''
const approvelTypeList = {
  'agree': '同意',
  'refuse': '拒绝',
  'revoke': '撤回'
} as Record<string, string>
const showBtn = ref(false)
const showAgree = ref(false)

// 人员选择
const showSelect = ref(false)
const userList = reactive({
  arr: [] as any[]
}) 
let threeLevelTaskNode = reactive({
  arr: [] as any[]
})
const handle = (list: any) => {
  userList.arr = list
}

const processFold = ref(false) // 流程是否展开
const nodeArr = reactive({
  arr: [] as any[]
})
const optionsFileList = reactive({
  arr: [] as any[]
}) // 操作时的文件列表
const acceptType = '.doc,.docx,.txt,.pdf,.ppt,.pptx,.xlsx,.xls,.avi,.mov,.mkv,.mpeg,.3gp,.wmv,.mp4,.flv,text/plain,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation'
// 在组件进入页面时获取接口数据
onActivated(() => {
  isPc.value = window.isPc !== 'mobile'
  const query = route.query
  processInstanceId = query.processInstanceId as string
  if (window.pathFrom === '/selectUser') {
    processDetail.value = window.processDetail
    const key = window.keys
    const item = window.userList
    threeLevelTaskNode.arr = window.threeLevelTaskNode
    handleProcessData(key as any, item)
  } else if (window.pathFrom === '/groupManage' || window.pathFrom === '/workflowManage' || window.pathFrom === '/') {
    loading.value = true
    getData()
  }
})
// 前往PC端
function goToPc(){
  window.point_diy.send_data('enter_PC', JSON.stringify({userAgent: 'pc'}))
  mixinPostJssdk(['checkJsApi', 'invoke', 'openDefaultBrowser', 'closeWindow'], openDefaultBrowser)
}
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
function getColumnsAjax (keyword:any = '') {
  const item = showSearchAjaxItem.value
  getAjax(item, keyword)
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
function getAjax (item: Item, keyword: string) {
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
  const paramsObj = params ? {[params]: keyword} : {}
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
function getPartCode (keyword:any = '') {
 getParts({
      searchText:keyword
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
function getLineCode (keyword:any = '') {
 getProductLine({}).then(res => {
  if (res.code==='0') {
    columns.value = res.data.map((item: { label: any, value: any,isShow:Boolean })=>{
      return{
        isShow:item.label.indexOf(keyword) !== -1,
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
function getModelCode (keyword:any = '') {
getModel({
      searchText:keyword
    }).then(res => {
      if (res.code==='0') {
        columns.value = res.data.map((item: { code: any, model: any,lineCode:any })=>{
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

function getPtsCodes (keyword:any = '') {
  getPtsCode({
    code:keyword
  }).then(res => {
    if (res.code==='0') {
      columns.value = [
        {
          isShow:true,
          label:res.data.model,
          lineName:res.data.lineName,
          value:keyword
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
function getColumns (keyword:any = '') {
  switch (dialogType.value) {
    case 'partCode':
      getPartCode(keyword)
      break;
    case 'productLine':
      getLineCode(keyword)
      break;
    case 'productModel':
      getModelCode(keyword)
      break;
    case 'PTSScan':
      getPtsCodes(keyword)
      break;
    case 'modelGetPdt':
      getModelCode(keyword)
      break;
    default:
      break;
  }
}
// 扫码
function scanQrCode (e:any) {
  // isDisabled.value = true
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
function getPtsModel(keyword:any) {
  getPtsCode({
    code:keyword
  }).then(res => {
    if (res.code==='0') {
      processDetail.value.forEach((item:any)=>{
        if (item.name==='PTSScan') {
          item.code = keyword
          item.lineName = res.data.lineName
          item.model = res.data.model
        }
        getProductLine({}).then(res => {
          if (res.code==='0') {
            res.data.forEach((jtem:any)=>{
             // 如果 产品线接口中的名字相同 ，就给给pts的产品码code赋值
              if (jtem.label === res.data.lineName) {
                item.lineCode = jtem.value
              }
            })
          }else{
            showDialog({
              message: res.message,
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
function filterColumns (keyword: any) {
  columns.value = columns.value.map((item: { label: any, value: any,isShow:Boolean }) => {
    item.isShow = item.label.indexOf(keyword) === -1 ? false :true
    return item
  });
}

// 各种弹窗确认内容
function onConfirm(val:any) {
  const oldArr = processDetail.value
  const newArr = oldArr.map((item: { id: any;value:any; lineName: any,code:any,lineCode:any,model:any, props: {text:any} }) => {
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
    } else if(dialogType.value === 'modelGetPdt'){
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
      item.value = val.label
      item.code = val.value
    }
  }
    return item
  })
  processDetail.value = newArr
  showSearch.value = false
  showSearchAjax.value = false
}

interface UploadResult {
  fileName: string;
  url: string;
}
interface FileResult {
  fileUrl: string;
  originFile: string;
}
// 流程详情
function getData() {
  const postObj = {
    processInstanceId: processInstanceId
  }
  return getDetail(postObj).then(res => {
    if (res.code === '0') {
      const data = res.data || {}
      showAgree.value = data.checkNode
      document.title = data.processTemplates.formName 
      // 流程创建中的表单项
      formItems = JSON.parse(data.processTemplates.formItems)
      assignee = data.assignee
      isRevoke = data.cancel
      // 流程表单项，针对当前角色权限的只读、编辑、隐藏 R、E、H
      formPerms = data.currentNode.props.formPerms
      // 针对当前角色权限，可显示表单项
      processFormData = data.formData
      taskId = data.taskId
      // 设置操作按钮是否可以点击
      if (assignee === userId) {
        showBtn.value = true
      } else {
        showBtn.value = false
      }
      // 需要判断assignee 和当前登录人是否同一个  不是则全部只读
      // 当前节点可编辑的组件 currentNode.props.formPerms
      // 遍历formItems和formPerms数组 把formPerms的值赋给formItems的perm
      formItems.forEach((item: any) => {
        Object.keys(processFormData).forEach(key => {
          if(item.id === key) {
            if (item.name === 'PTSScan') { 
              item.code = processFormData[key].code
              item.lineName = processFormData[key].lineName
              item.lineCode = processFormData[key].lineCode
              item.model = processFormData[key].model
            } 
            else if (item.name === 'SelectInterface') {
              item.value = processFormData[key]
              item.props.text = item.value.map((val:any) => val.text).join('，')
            }
            else if (item.name === 'ImageUpload') {
              for(let i = 0; i < processFormData[key].length; i++) {
                if (typeof processFormData[key][i] === 'string') {
                  processFormData[key][i] = {
                    url: processFormData[key][i], 
                    fileUrl: processFormData[key][i], 
                    name: processFormData[key][i].split('/')[processFormData[key][i].split('/').length - 1]
                  }
                } else {
                  if (processFormData[key][i].url.indexOf('internalres.joyoung.com') !== -1 || processFormData[key][i].url.indexOf('internalres-test.joyoung.com') !== -1) {
                    getFileUrlV2({
                      objectName: processFormData[key][i].url
                    }).then((result: unknown) => {
                      const { fileUrl, originFile } = result as FileResult
                      processFormData[key][i].fileUrl = fileUrl
                    })
                  } else {
                    processFormData[key][i].fileUrl = processFormData[key][i].url
                  }
                }
                if (i === processFormData[key].length - 1) item.value = processFormData[key]
              }
            }
            else {
              item.value = processFormData[key]
            }
          }
        })
      })
      if(!formPerms.length) {
        formItems.forEach((item: any) => {
          item.perm = 'R'
        })
      } else  {
        formItems.forEach((item: any) => {
          formPerms.forEach((perm: { id: any, perm: any }) => {
            // 登录人不是当前节点 将所有组件只读
            if (assignee !== userId) {
              item.perm = 'R'
            } else if(item.id === perm.id) {
              item.perm = perm.perm
            }
          })
        })
      }
      //recursiveRequest(formItems[0].value, 0, formItems)
      processDetail.value = formItems
      getProcessData()
    } else {
      loading.value=false
    }
  }).catch(err => {
    loading.value=false
  })
}

// 更新某个值
function handleProcessData(key: string, val: any) {
  console.log(key, val,processDetail.value)
  const oldArr = processDetail.value
  const newArr = oldArr.map((item: { id: any; value: any,name:any,props:{text:any} }) => {
    if (item.id === key) {
      if (item.name === 'SelectInterface') {
        item.props.text = val.map((item: any) => {
          return item.text
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
    // 提交数据oss文件作处理
    else if(curr.name === 'ImageUpload'){
      let list = []
      const imgData = curr.value || []
      list = imgData.map((item:any)=>{
        return {
          'name':item.name,
          'url':item.url
        }
      })
      acc[curr.id] = list
    }
    
    else if(curr.name === 'FileUpload'){
      let list = []
      const fileData = curr.value || []
      list = fileData.map((item:any)=>{
        return {
          'name':item.name,
          'url':item.url
        }
      })
      acc[curr.id] = list
    }
    // else if(curr.name === 'PartCode'){
    //   acc[curr.id] = 
    //   { 
    //     'code':curr.code,
    //     'value':curr.value
    //   }
    // }
    
    else{
      const value = typeof curr.value === 'number' ? curr.value + '' : curr.value
      // 内容有值
      if(value && value.length>0 && Object.keys(value).length > 0){
        acc[curr.id] = value;
      }
      // 转办、分阅-暂时不做校验
      //  else {
      //   // empty
      //   if (curr.props.required && curr.perm === 'E') {
      //     showToast(`请完善表单中${curr.title}的内容`)
      //     return
      //   }
      // }
    }
    return acc;
  }, {});
  return result
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
function changeSingleDate(item: { id: string, value: string }) {
  dataTime.value = item.value
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
  const arr = []
  for (let i = 0; i < list.length; i++) {
    arr.push(list[i].fileUrl)
  }
  showImagePreview({
    images: arr,
    startPosition: index,
    closeable: true
  });
}

// 上传图片
function afterReadImg(files:any, item: {
  value: never[], id: any 
}) {
  loading.value = true
  const key = item.id
  let newVal:any = item.value || []
  if (Array.isArray(files)) {
    const list:any = []
    for (let i = 0; i < files.length; i++) {
      loading.value = true
      ossUploadFile({ appModuleCode: 'flowApprove', file: files[i].file }).then((res: unknown) => {
        const { fileName, url } = res as UploadResult
        getFileUrlV2({
          objectName: url
        }).then((result: unknown) => {
          const { fileUrl, originFile } = result as FileResult
          list.push({url: url, name: fileName, fileUrl})
          newVal = newVal.concat({url: url, name: fileName, fileUrl})
          loading.value = false
          handleProcessData(key, newVal)
        })
      })
    }
  } else {
    ossUploadFile({ appModuleCode: 'flowApprove', file: files.file }).then((res: unknown) => {
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
      // ossUploadFile({ appModuleCode: 'flowApprove', file: files[i].file }).then((res: unknown) => {
      cloudOssUpload(files[i].file, 'flowApprove').then((res: unknown) => {
        const { fileName, url } = res as UploadResult
        newVal = newVal.concat({url: url, name: fileName})
        loading.value = false
        handleProcessData(key, newVal)
      })
    }
  } else {
    // ossUploadFile({ appModuleCode: 'flowApprove', file: files.file }).then((res: unknown) => {
    cloudOssUpload(files.file, 'flowApprove').then((res: unknown) => {
      const { fileName, url } = res as UploadResult
      loading.value = false
      newVal = newVal.concat({url: url, name: fileName})
      handleProcessData(key, newVal)
    })
  }
 
}

// 操作记录上传附件
function optionsUploadFile(files:any) {
  if(optionsFileList.arr.length >= 3) {
    showToast('最多上传3个附件')
    return
  }
  loading.value = true
  if (Array.isArray(files)) {
    for (let i = 0; i < files.length; i++) {
      // ossUploadFile({ appModuleCode: 'flowSend', file: files[i].file }).then((res: unknown) => {
      cloudOssUpload(files[i].file, 'flowApprove').then((res: unknown) => {
        const { fileName, url } = res as UploadResult
        optionsFileList.arr = optionsFileList.arr.concat({url: url, name: fileName})
        loading.value = false
      })
    }
  } else {
    // ossUploadFile({ appModuleCode: 'flowSend', file: files.file }).then((res: unknown) => {
    cloudOssUpload(files.file, 'flowSend').then((res: unknown) => {
      const { fileName, url } = res as UploadResult
      loading.value = false
      optionsFileList.arr = optionsFileList.arr.concat({url: url, name: fileName})
    })
  }
}

// 删除操作记录附件
function optionsDeleteFile(index: any) {
  optionsFileList.arr.splice(index, 1)
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

// 跳转小程序
function jumpToWechat (item: { value: string }) {
  console.log(item.value)
  location.href = item.value
}

// 人员选择
function choosePerson(item: any) {
  currentKey.value = item.id
  window.processDetail = processDetail.value
  window.userList = item.value || []
  window.threeLevelTaskNode = threeLevelTaskNode.arr
  window.keys = item.id
  router.push({
    path: '/selectUser'
  })
}

// 人员选择确认
function selectPersonBtnSubmit() {
  showSelect.value = false
  const key = currentKey.value
  const newVal = userList.arr
  handleProcessData(key, newVal)
}
// 删除选中人员
function deleteUser(index: any, item: any) {
  const key = currentKey.value
  let newVal = item.splice(index, 1)
  child.value.setUserList(newVal)
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
  item.props.columns.forEach((col: {field: String}) => {
    obj[col.field + ''] = ''
  })
  item.value.push(obj)
}
function delTable (item: {
  value: Array<any>
}, index: any) {
  item.value.splice(index, 1)
}

// 操作记录
function getProcessData() {
  const postObj = {
    processInstanceId: processInstanceId
  }
  return getProcess(postObj).then(res => {
    if (res.code === '0') {
      const arr = res.data || []
      arr.forEach((item: {
        groupTime:string, 
        list: { 
          length: any; 
          filter: ( arg0: { (val: { endTime: any }): any; (val: { endTime: any }): boolean }) => never[]; 
          forEach: ( arg0: (
            listItem: {
              endTime: any; 
              currentNode: any; 
              nodeType: string; 
              activityName: string; 
              businessStatus: any 
            }
          ) => void) => void
        }
      }) => {
        item.groupTime = item.groupTime.slice(5)
        if (item.list && item.list.length) {
          const opt = item.list.filter((val: { endTime: any }) => val.endTime) || []
          const notOpt = item.list.filter((val: { endTime: any }) => !val.endTime) || []
          const currentNode = notOpt.map((val: { assignee: any }) => val.assignee).join(', ')
          if (notOpt.length) {
            const newObj:any = notOpt[0]
            const newArr:any = []
            newObj.assignee = currentNode
            newArr.push(newObj)
            item.list = opt.concat(newArr)
          }

          item.list.forEach((listItem: { endTime: any; currentNode: any; nodeType: string; activityName: string; businessStatus: any }) => {
            if (!listItem.endTime) {
              listItem.currentNode = currentNode
              listItem.nodeType = 'CURRENT'
            } else {
              listItem.endTime = listItem.endTime.slice(5)
              listItem.nodeType = listItem.businessStatus
            }
          })
        }
      })
      arr[0].list[0].nodeType = 'INIT'
      nodeArr.arr = arr
      processFold.value = false
      processFlod()
    }
  }).finally(() => {
    loading.value=false
  })
}

// 操作记录展开或收起
function processFlod () {
  const arr = nodeArr.arr
  // 先删除FOLD节点
  arr.forEach((item: any) => {
    if (item.list.length > 0) {
      item.list = item.list.filter((item: any) => {
        return item.nodeType !== 'FOLD'
      })
    }
  })
  // 节点大于2 设置展开收起
  if (arr.length > 2) {
    if (!processFold.value) {
      const flodObj = {
        nodeType: 'FOLD',
        businessStatusName: '查看更多',
        flodTitle: '查看更多'
      }
      arr[0].list.splice(1, 0, flodObj)
      const nodeArr = [...arr.slice(0, 1), ...arr.slice(-1)]
      threeLevelTaskNode.arr = nodeArr
    } else {
      // arr倒数第二个索引的list的数组末尾插入flodObj
      const flodObj = {
        nodeType: 'FOLD',
        businessStatusName: '收起更多',
        flodTitle: '收起更多'
      }
      arr[arr.length - 2].list.push(flodObj)
      threeLevelTaskNode.arr = arr
    }
  } else {
    threeLevelTaskNode.arr = arr
  }
}

// 点击展开
function activeFlod() {
  processFold.value = !processFold.value
  processFlod()
}

// 同意
function btnAgree() {
  if (!showBtn.value) return
  if (!validateForm()) return
  openDialog.value = true
  approvelType = 'agree'
}

// 表单必填项校验
function validateForm() {
  const data = processDetail.value
  for (let i = 0; i < data.length; i++) {
    const curr = data[i]
    const value = typeof curr.value === 'number' ? curr.value + '' : curr.value
    // 判断 数字、字符串、数组、对象 是否都有值
    if (curr.props.required && curr.perm === 'E' && !(value && value.length > 0)) {
      // 过滤pts扫码、产品线、产品型号
      if (!((curr.name === 'PTSScan' && curr.code) || ((curr.name === 'ProductLine' || curr.name === 'ProductModel') && value.value))) {
        showToast(`请完善表单中${curr.title}的内容`)
        return false
      }
    }
  }
  return true
}
function agree() {
  const formData = handlePostData(processDetail.value)
  if (!formData) return
  const postObj = {
    processInstanceId: processInstanceId,
    taskId: taskId,
    signFlag: false,
    formData: formData,
    comments: approvel.value,
    attachments: optionsFileList.arr
  }
  handleAgree(postObj).then(res => {
    if (res.code === '0'){
      showSuccessToast('同意成功！')
      router.replace({
        path: '/workflowManage'
      })
    }
  })
}
// 转办
function transfer() {
  if (!showBtn.value) return
  const formData = handlePostData(processDetail.value)
  router.push({
    path: '/transfer',
    query: {
      processInstanceId: processInstanceId,
      taskId: taskId,
      formData: JSON.stringify(formData),
    }
  })
}
// 分阅
function circulate () {
  const formData = handlePostData(processDetail.value)
  router.push({
    path: '/circulate',
    query: {
      processInstanceId: processInstanceId,
      taskId: taskId,
      formData: JSON.stringify(formData)
    }
  })
}
// 拒绝
function btnRefuse() {
  if (!showBtn.value) return
  if (!validateForm()) return
  openDialog.value = true
  approvelType = 'refuse'
}
function refuse() {
  if(!approvel.value) {
    showToast('请填写审批意见！')
    return
  }
  const formData = handlePostData(processDetail.value)
  const postObj = {
    processInstanceId: processInstanceId,
    taskId: taskId,
    signFlag: false,
    formData: formData,
    signInfo: '',
    comments: approvel.value,
    attachments: optionsFileList.arr
  }
  handleRefuse(postObj).then(res => {
    if (res.code === '0'){
      showSuccessToast('拒绝成功！')
      router.replace({
        path: '/workflowManage'
      })
    }
  })
}
// 撤销
function btnRevoke () {
  if (!showBtn.value) return
  if (!validateForm()) return
  openDialog.value = true
  approvelType = 'revoke'
}
function revoke() {
  if(!approvel.value) {
    showToast('请填写撤回原因！')
    return
  }
  const formData = handlePostData(processDetail.value)
  const postObj = {
    processInstanceId: processInstanceId,
    taskId: taskId,
    signFlag: false,
    formData: formData,
    signInfo: '',
    comments: approvel.value
  }
  handleRevoke(postObj).then(res => {
    if (res.code === '0'){
      showSuccessToast('撤回成功！')
      router.back()
    }
  })
}

// 确认审批
function confirmApprovel() {
  if(approvelType === 'agree') {
    agree()
  }
  if (approvelType === 'refuse') {
    refuse()
  }
  if (approvelType === 'revoke') {
    revoke()
  }
}
// 锚点
function jumpToAnchor(name: string) {
  const anchorElement = document.getElementById(name)
  if (anchorElement) {
    window.scrollTo({
      top: anchorElement.offsetTop,
      behavior: 'smooth'
    });
  }
}
// 返回工作台
function returnWork() {
  router.replace({
    path: '/workflowManage'
  })
}
</script>

<style lang="less" scoped>
.page{
  padding-bottom: 170px;
  background: #fff
}
.topTip{
  color: red;
  font-size: 28px;
  margin-right: 5px;
}
.flex-Box{
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  background: #F5F5F5;
  .operation-group{
    position: fixed;
    width: 750px;
    bottom: 0;
    left: 50%;
    z-index: 100;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-around;
    background: #fff;
    box-shadow: 0px 10px 30px 0px rgba(43,52,104,0.12);
    .operation-item{
      width: 188px;
      height: 136px;
      text-align: center;
      font-size: 28px;
      color: #333333;
      line-height: 30px;
      cursor: pointer;
      img{
        display: block;
        width: 56px;
        height: 56px;
        margin: 20px auto 0 auto;
      }
    }
    .operation-item-agree{
      color: #008907;
    }
    .operation-item-refuse{
      color: #FE4040;
    }
    .unclick{
      opacity: 0.4;
      cursor: not-allowed;
      &:hover{
        cursor: not-allowed;
      }
    }
  }
  .operation-record{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 30px 0 16px;
    .operation-record-item{
      width: 250px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: #333333;
      cursor: pointer;
      img{
        width: 32px;
        height: 32px;
        margin-right: 10px;
      }
    }
    .middle {
      border-left: 2px solid #c6c6c6;
      border-right: 2px solid #c6c6c6;
    }
    .left {
      width: 375px;
      border-right: 2px solid #c6c6c6;
    }
    .right {
      width: 375px;
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
    .process-label-title{
      font-size: 28px;
      padding-right: 20px;
      color: #999;
      font-weight: 600;
      line-height: 40px;
      padding-bottom: 10px;
    }
    .process-label-content{
      overflow: hidden;
      font-size: 30px;
      color: #333333;
      line-height: 42px;
      padding-bottom: 20px;
      .img-list{
        display: flex;
        position:relative;
        width: 160px;
        height: 160px;
        float: left;
        background: #F7F8FA;
        cursor: pointer;
        :deep(.van-icon-clear){
          position: absolute;
          right: 8px;
          top:8px;
          color: rgba(0, 0, 0, 0.7)
        }
        margin: 0 10px 10px 0;
      }
      .process-label-img{
        display: block;
        max-width: 100%;
        max-height: 100%;
        margin: auto
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
    .process-content-box{
      padding: 23px 0;
      overflow: hidden;
      font-size: 28px;
      color: #000;
      line-height: 40px;
      border-bottom: 1px solid #E7E7E7;
      .topTip{
        float: left;
      }
      .process-label{
        padding-right: 20px;
        float: left;
        color: #999;
        font-weight: 600
      }
      .process-content{
        float: left;
        color: #333;
        .upload-file-btn{
          width: auto;
          padding: 5px 10px;
          margin-top: 10px;
          cursor: pointer;
          word-break: break-all;
        }
      }
      .process-label-content{
        padding: 10px 0 0 0;
      }
      :deep(.textarea-readonly-box){
        padding-top: 10px;
        padding-bottom: 0;
        border: none;
      }
      :deep(.van-field__control){
        font-size: 28px !important;
      }
      .process-label-user{
        padding-bottom: 0;
      }
      .process-label-tips{
        color: #666; 
        font-size: 24px;
      }
    }

    .process-content-box.diplay-block{
      display: block;
      .process-label{
        float: none;
      }
    }
    .process-content-box:last-child{
      border-bottom: none;
    }
    .process-filed-bg .van-field{
      font-size: 28px;
      color: #333333;
      line-height: 40px;
      padding: 16px;
      background: #F7F8FA;
      border-radius: 16px;
      cursor: pointer;
    }
    .van-checkbox{
      width: 100%;
      padding-top: 24px;
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
  .process-detail.top{
    margin-top: 0;
  }
  .progress-box{
    overflow-y: auto;
    background: #fff;
    margin-top: 20px;
    padding: 32px 32px 0 32px;
    
    .process-title{
      font-size: 32px;
      color: #333;
      line-height: 44px;
      font-weight: 600;
      padding-bottom: 10px;
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

    :deep(.van-step__circle){
      background: #DCDEE0;
      width: 16px;
      height: 16px;
    }
    :deep(.van-step--vertical){
      padding: 0 20px 10px 20px;
      margin-bottom: 20px;
      .van-step__line {
        top: 28px;
      }
      .van-step__circle-container{
        top: 19px
      }
      .van-icon-checke{
        color: #FF7515;
      }
      .van-icon-checked:before{
        font-size: 38px;
      }
    }
   
  }
}
:deep(.van-ellipsis){
  overflow: initial
}
:deep(.van-picker__confirm){
  color: #FF7515;
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
  left: 50%;
  transform: translateX(-50%);
  width: 750px;
  padding-bottom: 20px;
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
  .option-content-box{
    padding: 26px 32px;
    .content{
      padding: 24px 0;
      :deep(.van-field){
        font-size: 28px;
        background: #F7F8FA;
        border-radius: 16px;
      }
    }
  }
  
  .btn-box{
    display: flex;
    border-top: 1px solid #D5D5D5;
    padding: 16px 32px 0 32px;
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
.select-person-box{
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 100;
  top: 0;
  left: 0;
  background: #F5F5F5;
  .add-people-box{
    padding: 32px 32px 0 32px;
    background: #fff;
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
    max-width: 750px;
    width: 100%;
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
.textarea-readonly-box{
  padding: 0;
  font-size: 30px;
  color: #333333;
  line-height: 42px;
  padding-bottom: 20px;
  border-bottom: 1px solid #E7E7E7;
}
.default-overlay {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: 750px;
}

.border-btn{
  font-size: 26px;
  color: #FF7515;
  line-height: 48px;
  width: 137px;
  height: 48px;
  border-radius: 24px;
  border: 1px solid #FF7515;
  text-align: center;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    cursor: pointer;
  }
}
.box-title-icon{
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
.upload-file-btn{
  font-size: 28px;
  color: #FF7515;
  line-height: 40px;
  width: auto;
  min-height: 40px;
  padding: 8px 12px;
  background: #F7F8FA;
  border-radius: 8px;
  cursor: pointer;
  span {
    text-align: left;
    cursor: pointer;
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
      margin-top: 20px;
    }
    .table-con-box+.table-con-box{
      border-top: 1px solid #E7E7E7;
    }
    .table-con-title{
      display: flex;
      align-items: baseline;
      justify-content: space-between;
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
        font-size: 28px;
        color: #333;
        line-height: 40px;
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


.options-upload-file{
  display: flex;
  justify-content: left;
  align-items: center;
  font-size: 28px;
  color: #FF7515;
  background: #F7F8FA;
  padding:5px;
  line-height: 40px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 8px;
  :deep(.van-icon-description-o) {
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
.box-upload-file{
  padding-top: 16px
}
.upload-file-box{
  display: flex;
  justify-content: left;
  align-items: center;
  font-size: 28px;
  color: #4C4C4C;
  line-height: 40px;
  margin-bottom: 20px;
  :deep(.van-icon-description-o) {
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
:deep(.van-cell:after) {
 border-bottom: 0;
}
.clear{
  clear: both;
}
.steps{
  .step-item {
    position: relative;
    display: flex;
    align-items: flex-start;
    margin-bottom: 25px;
    padding-left: 44px;
    font-size: 22px;
  }
  .step-item-group {
    font-size: 24px;
  }
  .step-item-divider{
    margin-top: 25px; 
    border-top: 1px dashed #E7E7E7;
  }
  .step-dot {
    position: absolute;
    width: 13px;
    height: 13px;
    border-radius: 12px;
    // background-color: #FF7515;
    border: 2px solid #FF7515;
    top: 14px;
    left: 9px;
    z-index: 10;
    box-sizing: border-box;
  }
  .step-dot-node{
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    // background: rgba(255, 117, 21, 0.2);
    border-radius: 28px;
    top: 7px;
    left: 0;
    .step-dot-center{
      width: 13px;
      height: 13px;
      background: #FF7515;
      border-radius: 12px;
      margin: auto;
    }
  }
  .step-dot-default{
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 12px;
    background-color: #C8C9CC;
    top: 14px;
    left: 8px;
  }
  .step-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    // 左右布局
    .strp-content-lrlayout{
      .flex-between{
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .flex-1{
        flex: 1;
      }
      .step-content-lrlayout-top{
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .step-content-lrlayout-bottom{
        padding-left: 91px;
      }
      .step-option-2{
        display: inline-block;
        margin-right: 16px;
        padding: 6px 14px;
        min-width: 75px;
        text-align: center;
        border-radius: 8px;
        white-space: nowrap;
        box-sizing: border-box;
      }
      // 同意
      .step-option-success-2{
        color: #008907;
        background: rgba(0, 137, 7, 0.1);
      }
      // 拒绝
      .step-option-refuse-2{
        color: #FE4040;
        background: rgba(254, 64, 64, 0.1);
      }
      // 分阅
      .step-option-parmary-2{
        color: #FF7515;
        background: rgba(255, 117, 21, 0.1);
      }
      // 待办
      .step-option-current{
        color: #666666;
        background: rgba(102, 102, 102, 0.1);
      }
      .step-text-assignee{
        font-weight: 500;
        font-size: 28px;
        color: #323233;
        line-height: 40px;
      }
      .step-text-time{
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 140px;
        // display: inline-block;
        color: #999;
        font-size: 24px;
        line-height: 40px;
        // text-align-last:justify;
        text-align: justify;
        white-space: nowrap;
      }
      .step-text-time:after{
        display:inline-block;
        width:100%;
      }
      // 灰色底的内容
      .step-text-content-gray{
        margin-top: 10px;
        padding: 12px;
        background: #F7F8FA;
        border-radius: 8px;
      }
      .step-text-gray{
        padding: 12px 0;
        font-weight: 400;
        font-size: 28px;
        color: #666666;
        line-height: 40px;
      }
    }
    .step-node-title {
      font-weight: 600;
      font-size: 30px;
      color: #323233;
      line-height: 40px;
    }
    .step-options-content{
      width: 100%;
      display: flex;
      justify-content: space-between;
      .step-content-left {
        max-width:450px;
        font-size: 28px;
        line-height: 40px;
      }
      .step-content-left-box {
        display: flex;
        justify-content: space-between;
        // background: #646566;
      }
      .step-color-parmary{
        color: #FF7515;
        font-size: 24px;
        cursor: pointer;
      }
      .step-color-default{
        color: #323233;
      }
      .step-option-success{
        padding-left: 8px;
        color: #008907
      }
      .step-option-refuse{
        padding-left: 8px;
        color: #FE4040
      }
      .step-color-time{
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        // position: relative;
        // right: -10px;
        width: 170px;
        // display: flex;
        color: #999;
        font-size: 24px;
        line-height: 40px;
        // justify-content: space-between;
        text-align:justify;
      }
      .step-color-time:after{
        display:inline-block;
        width:100%;
      }
      .step-people-box{
        font-size: 28px;
      }
      .option-suggest-content{
        font-size: 28px
      }
    }
    .title-opinion-content {
      overflow: hidden;
      color: #666;
      font-size: 28px;
      :deep(.van-text-ellipsis__action){
        color: #333;
        font-weight: 600;
      }
    }
  }
  .step-title {
    font-weight: bold;
    font-size: 28px;

  }
  .step-desc {
    font-size: 28px;
    line-break: 40px;
    padding-top: 4px;
    color: #999;
  }
  .step-line {
    position: absolute;
    top: 40px; /* 根据圆点的尺寸调整 */
    left: 14px; /* 将竖线居中对齐 */
    bottom: -20px; /* 调整竖线的长度 */
    width: 1px;
    background-color: #FF7515
  }
  .step-line-node{
    position: absolute;
    top: 43px; /* 根据圆点的尺寸调整 */
    left: 14px; /* 将竖线居中对齐 */
    bottom: -20px; /* 调整竖线的长度 */
    width: 1px;
    background-color: #FF7515
  }
  .step-line-default{
    position: absolute;
    top: 40px; /* 根据圆点的尺寸调整 */
    left: 14px; /* 将竖线居中对齐 */
    bottom: -20px; /* 调整竖线的长度 */
    width: 1px;
    background-color: #C8C9CC
  }
  .step-line-none{
    display: none;
  }
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