<template lang="pug">
.content-wrapper
    section
      .container
        h1.ui-title-1 Home
        input(
          type="text"
          placeholder="What we will watch?"
          v-model="taskTitle"
          @keyup.enter="onSubmit"
        )
        textarea(
          placeholder="What we will watch?"
          v-model="taskDescription"
          @keyup.enter="onSubmit"
        )
        .option-list
          input.what-watch--radio(
            type="radio"
            id="radioFilm"
            value="Film"
            v-model="whatWatch"
          )
          label(
            for="radioFilm"
          ) Film
          input.what-watch--radio(
            type="radio"
            id="radioSerial"
            value="Serial"
            v-model="whatWatch"
          )
          label(
            for="radioSerial"
          ) Serial
        .total-time
            // Film Time
            .total-time__film(
              v-if="whatWatch === 'Film'"
            )
              span.time-title Hours
              input.time-input(
                type="number"
                v-model="filmHours"
              )
              span.time-title Minutes
              input.time-input(
                type="number"
                v-model="filmMinutes"
              )
              // Show time
              p {{ filmTime }}

            // Serial Time
            .total-time__serial(
              v-if="whatWatch === 'Serial'"
            )
              span.time-title How many season?
              input.time-input(
                type="number"
                v-model="serialSeason"
              )
              span.time-title How many series?
              input.time-input(
                type="number"
                v-model="serialSeries"
              )
              span.time-title How long is one series? (minutes)
              input.time-input(
                type="number"
                v-model="serialSeriesMinutes"
              )
              // Show time
              p {{ serialTime }}

        .tag-list.tag-list--add
            .ui-tag__wrapper(
              @click="tagMenuShow = !tagMenuShow"
            )
              .ui-tag
                span.tag-title Add New
                span.button-close(
                  :class="{ active: !tagMenuShow }"
                )
        transition(name="fade")
          .tag-list.tag-list--menu(
            v-if="tagMenuShow"
          )
            input.tag-add--input(
              type="text"
              placeholder="New tag"
              v-model="tagTitle"
              @keyup.enter="newTag"
            )
            .button.button-default(
              @click="newTag"
            ) Send tag

        // Show All Tags
        .tag-list
            transition-group.tags-animate(
              enter-active-class="animated fadeInRight"
              leave-active-class="animated fadeOutDown"
            )
              .ui-tag__wrapper(
                v-for="tag in tags"
                :key="tag.id"
              )
                .ui-tag.tags-animate(
                  @click="addTagUsed(tag)"
                  :class="{used: tag.use}"
                )
                  span.tag-title {{ tag.title }}
                  span.button-close(@click="deleteTag(tag.id)")

        .button-list
          button.button.button--round.button-primary(
            type="submit"
            @click="onSubmit"
            :disabled="submitStatus === 'PENDING'"
          ) Send
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Home',
  props: {
  },
  data: () => ({
    submitStatus: null,
    taskTitle: '',
    taskDescription: '',
    whatWatch: 'Film',
    // Total Time
    // Film
    filmHours: 1,
    filmMinutes: 30,
    // Serial
    serialSeason: 1,
    serialSeries: 11,
    serialSeriesMinutes: 40,
    // Tags
    tagTitle: '',
    tagMenuShow: false,
    tagsUsed: []
  }),
  // Vuelodate
  validations: {
    taskTitle: {
      required
    }
  },
  methods: {
    ...mapActions([
      'NEW_TASK',
      'NEW_TAG',
      'DELETE_TAG',
      'LOAD_TAGS'
    ]),
    newTag () {
      // TODO: Vuelodate
      if (this.tagTitle === '') {
        return
      }
      const tag = {
        title: this.tagTitle,
        use: false
      }
      this.NEW_TAG(tag)
      this.tagTitle = ''
    },
    // Delete Tag
    // Add Used Tag
    addTagUsed (tag) {
      tag.use = !tag.use
      if (tag.use) {
        this.tagsUsed.push({
          title: tag.title
        })
      } else {
        this.tagsUsed.splice(tag.title, 1)
      }
    },
    deleteTag (id) {
      this.DELETE_TAG(id)
        .then(() => {
          console.log('tag deleted')
        })
    },
    onSubmit () {
      // Initialize Vuelodate
      this.$v.$touch()
      // Invalid
      if (this.$v.$invalid) {
        console.log('ERROR')
        this.submitStatus = 'ERROR'
      // Valid
      } else {
        // Time (What Watch)
        let time
        if (this.whatWatch === 'Film') {
          time = this.filmTime
        } else {
          time = this.serialTime
        }
        // Task
        const task = {
          title: this.taskTitle,
          description: this.taskDescription,
          whatWatch: this.whatWatch,
          time,
          tags: this.tagsUsed,
          completed: false,
          editing: false
        }
        this.NEW_TASK(task)
          .then(() => {
            this.submitStatus = 'OK'
          })
          .catch(err => {
            this.submitStatus = err.message
          })
        // Reset
        this.taskTitle = ''
        this.taskDescription = ''
        // Reset $v (validate)
        this.$v.$reset()
        // Reset for Tags
        this.tagMenuShow = false
        this.tagsUsed = []
        this.tagTitle = ''
        // Reset tags.use + class used
        for (let i = 0; i < this.tags.length; i++) {
          this.tags[i].use = false
        }
      }
    },

    getHoursAndMinuts (minutes) {
      const hours = Math.trunc(minutes / 60)
      const min = minutes % 60
      return hours + ' Hours ' + min + ' Minutes  '
    }
  },
  computed: {
    ...mapGetters([
      'TAGS'
    ]),
    tags () {
      return this.TAGS
    },
    filmTime () {
      const min = (this.filmHours * 60) + (this.filmMinutes * 1)
      return this.getHoursAndMinuts(min)
    },
    serialTime () {
      const min = this.serialSeason * this.serialSeries * this.serialSeriesMinutes
      return this.getHoursAndMinuts(min)
    }
  }
}
</script>

<style lang="stylus" scoped>
.option-list
  display flex
  align-items center
  margin-bottom 20px
  .what-watch--radio
    margin-right 12px
  input
    margin-bottom 0
  label
    margin-right 20px
    margin-bottom 0
    &:last-child
      margin-right 0
//
// Total time
//
.total-time
  margin-bottom 20px
.time-title
  display block
  margin-bottom 6px
.time-input
  max-width 80px
  margin-right 10px
//
// Tags
//
.tag-list
  margin-bottom 20px
.ui-tag__wrapper
  margin-right 18px
  margin-bottom 10px
  &:last-child
    margin-right 0
.ui-tag
  &.used
    background-color: #444ce0
    color #fff
    .button-close
      &:before,
      &:after
        background-color: #fff
  .button-close
    &.active
      transform: rotate(45deg)
// Tag Menu Show
.tag-list--menu
  display flex
  justify-content space-between
  align-items center
// New Tag Input
.tag-add--input
  margin-bottom 0
  margin-right 10px
  height 42px
//
// Total Time
//
.total-time
  p
    margin-bottom 6px
  span
    margin-right 16px
  .task-input
    max-width 80px
    margin-bottom 28px
    margin-right 10px
.button-list
  display flex
  justify-content flex-end
//
// Validate
//
.form-item
  .error
    display none
    margin-bottom 8px
    font-size 13.4px
    color #fc5c65
  &.errorInput
    .error
      display block
input
  &.error
    border-color #fc5c65
</style>
