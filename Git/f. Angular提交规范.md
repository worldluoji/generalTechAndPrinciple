# Angular 规范
在 Angular 规范中，Commit Message 包含三个部分，分别是 Header、Body 和 Footer
```
<type>[optional scope]: <description>
// 空行
[optional body]
// 空行
[optional footer(s)]
```
- 其中，Header 是必需的，Body 和 Footer 可以省略。在以上规范中，<scope>必须用括号 () 括起来， <type>[<scope>] 后必须紧跟冒号 ，冒号后必须紧跟空格，2 个空行也是必需的。
- 在实际开发中，为了使 Commit Message 在 GitHub 或者其他 Git 工具上更加易读，我们往往会限制每行 message 的长度。根据需要，可以限制为 50/72/100 个字。

## 一个例子
```
fix($compile): couple of unit tests for IE9
# Please enter the Commit Message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
# On branch master
# Changes to be committed:
# ...

Older IEs serialize html uppercased, but IE9 does not...
Would be better to expect case insensitive, unfortunately jasmine does
not allow to user regexps for throw expectations.

Closes #392
Breaks foo.bar api, foo.baz should be used instead
```

## header
### type
下图列出了 Angular 规范中的常见 type 和它们所属的类别，你在提交 Commit Message 的时候，一定要注意区分它的类别。举个例子，我们在做 Code Review 时，如果遇到 Production 类型的代码，一定要认真 Review，因为这种类型，会影响到现网用户的使用和现网应用的功能。
<img src="./pics/Angular Types.webp" />

### scope
- scope 是用来说明 commit 的影响范围的，它必须是名词。显然，不同项目会有不同的 scope。在项目初期，我们可以设置一些粒度比较大的 scope，比如可以按组件名或者功能来设置 scope；后续，如果项目有变动或者有新功能，我们可以再用追加的方式添加新的 scope。
- 这里想强调的是，scope 不适合设置太具体的值。太具体的话，一方面会导致项目有太多的 scope，难以维护。另一方面，开发者也难以确定 commit 属于哪个具体的 scope，导致错放 scope，反而会使 scope 失去了分类的意义。

### description
description 是 commit 的简短描述，必须以动词开头、使用现在时。比如，我们可以用 change，却不能用 changed 或 changes，而且这个动词的第一个字母必须是小写。通过这个动词，我们可以明确地知道 commit 所执行的操作。此外我们还要注意，结尾不能加英文句号。

<br>

## Body
- 可以通过 Body 部分，它是对本次 commit 的更详细描述，是可选的。
- 和 Header 里的一样，它也要以动词开头，使用现在时。
- 它还必须要包括修改的动机，以及和跟上一版本相比的改动点。

## Footer
- Footer 部分不是必选的，可以根据需要来选择，主要用来说明本次 commit 导致的后果。
- 在实际应用中，Footer 通常用来说明不兼容的改动和关闭的 Issue 列表
<br>
比如关闭的 Issue 列表：关闭的 Bug 需要在 Footer 部分新建一行，并以 Closes 开头列出，例如：Closes #123。
```
Change pause version value to a constant for image
    
    Closes #1137
```
不兼容的改动：如果当前代码跟上一个版本不兼容，需要在 Footer 部分，以 BREAKING CHANG: 开头，后面跟上不兼容改动的摘要。Footer 的其他部分需要说明变动的描述、变动的理由和迁移方法。

```
BREAKING CHANGE: isolate scope bindings definition has changed and
    the inject option for the directive controller injection was removed.

    To migrate the code follow the example below:

    Before:

    scope: {
      myAttr: 'attribute',
    }

    After:

    scope: {
      myAttr: '@',
    }
    The removed `inject` wasn't generaly useful for directives so there should be no code using it.
```

## Revert Commit
除了 Header、Body 和 Footer 这 3 个部分，Commit Message 还有一种特殊情况：如果当前 commit 还原了先前的 commit，则应以 revert: 开头，后跟还原的 commit 的 Header。而且，在 Body 中必须写成 This reverts commit <hash> ，其中 hash 是要还原的 commit 的 SHA 标识。
```
revert: feat(iam-apiserver): add 'Host' option

This reverts commit 079360c7cfc830ea8a6e13f4c8b8114febc9b48a.
```