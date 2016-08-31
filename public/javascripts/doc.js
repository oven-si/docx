/**
 * @file 文档页js
 * */
var $win = $(window);
var $navs = $('.docx-navs');
var $navbarH = $('.navbar').height();
var $docxTitle = $('.docx-files');
var $docxBd = $('.docx-body');
var $docxDir = $('.docx-dir>a');

/**
* pjax委托
* */
if ($.support.pjax) {
    $(document).pjax('a[href$=".md"]', '.docx-marked-wrap');
    $(document).on('pjax:success', function() {
        $('.docx-fade').addClass('docx-fade-active');
    });
}

$win.load(function () {
    $('.docx-fade').addClass('docx-fade-active');

    $win.on('resize', function () {
        $docxBd.height($win.height() - $navbarH);
    });

    $docxBd.height($win.height() - $navbarH);
});

/**
 * 搜索action
 * */
$win.on('keyup', function (e) {
    if (e.keyCode === 13) {
        var key = $('.docx-searchkey').val();
        $.ajax({
            url: '/api/search',
            data: {"name": key},
            type: 'post'
        }).done(function (data) {
            if (data.error === 0) {
                var matchedFiles = data.data || [];
                var htmlStr = '';
                var emptyString = '<div class="docx-search-nocontent">暂无匹配文档!</div>';
                matchedFiles.forEach(function (it) {
                    htmlStr +=  [
                        '<div class="docx-search-art">',
                        '    <div class="docx-search-title">',
                        '        <a href="' + it.path + '" class="doc-search-link">',
                                    it.title,
                        '        </a>',
                        '    </div>',
                        '    <div class="docx-search-content">',
                        '        <a href="' + it.path + '" class="doc-search-link">',
                                    it.content,
                        '        </a>',
                        '    </div>',
                        '</div>'
                    ].join('');
                });

                $('.docx-marked').html(htmlStr ? htmlStr : emptyString);
            }
        });
    }
});

// 初始化文档目录菜单
$navs.metisMenu();

$(window).on('load', function(event) {
    var pathname = location.pathname || '';
    var $pathDom = $('[data-path="'+ pathname +'"]');
    $pathDom.parents('.docx-submenu').addClass('in');
    $pathDom.parents('[data-dir]').addClass('active subactive');
    $docxTitle.removeClass('docx-active');
    $pathDom.addClass('docx-active').parents().remove('docx-active');
});

$docxTitle.add($docxDir).on('click', function () {
    $('.docx-active').removeClass('docx-active');
    $(this).addClass('docx-active');
});