global.views = {};

views.input_forms = _.T('','\
    div\
      form[action=/api/v1/iposts method=post]\
        label.control-label 제목\
        input.form-control[type=text name=title placeholder="제목을 입력하세요."]\
        br\
        br\
        label.control-label 제품 혹은 서비스\
        br\
        input.form-control[type=radio name=p_or_s value=product checked] 제품\
        input.form-control[type=radio name=p_or_s value=service] 서비스 \
        br\
        br\
        label.control-label 미션\
        textarea.form-control[type=text name=mission placeholder="미션"]\
        br\
        label.control-label 비전\
        textarea.form-control[type=text name=vision placeholder="비전"]\
        br\
        label.control-label 타겟 시장\
        textarea.form-control[type=text name=market placeholder="시장"]\
        br\
        label.control-label 핵심 아이디어\
        textarea.form-control[type=text name=main_idea placeholder="핵심 아이디어"]\
        br\
        label.control-label 구성원 정보\
        textarea.form-control[type=text name=member placeholder="구성원 정보"]\
        br\
        label.control-label 추가 정보\
        textarea.form-control[type=text name=extra_info placeholder="추가 정보"]\
        br\
        button[type=submit] 완료\
  ');

views.table = _.T('table', '\
    div\
      button 읽어오기\
      table\
        tr\
          td 제목\
          td 제품/서비스\
          td 미션\
          td 비전\
          td 시장\
          td 아이디어\
          td 구성원\
          td 추가 정보\
        {{',_.T.each("r", "\
        tr\
          td {{r.title}}\
          td {{r.p_or_s}}\
          td {{r.mission}}\
          td {{r.vision}}\
          td {{r.main_idea}}\
          td {{r.member}}\
          td {{r.extra_info}}\
        ")(), '}}\
  ');
