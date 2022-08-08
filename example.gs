function myFunction() {
  var form_name = "My cool test form";

  // This is the section for general settings for each question type. This assumes 
  // that all questions of a particular type share some attributes (eg, range of linear scale)
  var settings={};
  settings["addScaleItem"]={"setBounds": [0,5], "setLabels": ["Insufficient","Excellent"]};
  settings["addMultipleChoiceItem"]={"setChoiceValues": [["Too easy","A bit easy","Just right", 
                                                          "A bit hard", "Too diffiult"]]}

  // The form will be divided into sections. Make an array entry for each
  var sections = ["Overview"]; // This example has an overview
  var days = ["Monday","Tuesday"]; //and two days of lectures
  sections = sections.concat(days);

  // Provide the title of each section
  var titles = { 
      "Overview": "Overview questions"
        }
  
  days.forEach(function(day) {  
    titles[day]="Daily lectures - "+day;
  });
  Logger.log(titles);

  // Provide the set of questions in each section
  var questions={};
  questions["Overview"]= ["Name (Optional)",
                            "Overall program of the school",
                            "Overall evaluation of the school relative to your expectations",
                            "School application/registration process and forms",
                            "Travel information on the school website",
                            "Whiteman College Dorm Room",
                            "Support during practical sessions",
                            "Breakfasts",
                            "Coffee breaks",
                            "Lunches",
                            "Lecture Hall (PCTS, Jadwin Hall 407)"
                            ];

  // Specify the question type for each question (these are methods in the forms API)
  var question_types={};
  question_types["Overview"]=["addTextItem", "addScaleItem", "addScaleItem",
                              "addScaleItem", "addScaleItem", "addScaleItem",
                              "addScaleItem", "addScaleItem", "addScaleItem",
                              "addScaleItem", "addScaleItem"];

  // For the daily lectures, we ask a standard set of questions for each lecture. 
  // First we itemize the lectures on each day, and then specify the questions
  // to be asked of each lecture.
  var lectures = {
    "Monday": ["Setup and Collaborative Programming (Kilian Lieret)",
               "What Every Computational Physicist Should Know About Computer Architecture (Steve Lantz)",
               "Vector Parallelism on Multi-Core Processors (Steve Lantz, Monday/Tuesday)",
               "The Scientific Python Ecosystem (Henry Schreiner)" 
               ],
    "Tuesday": ["David Lange for Dan Riley - The Use and Abuse of Random Numbers",
                "Bei Wang - Floating Point Arithmetic Is Not Real",
                "Steve Lantz - Introduction to Performance Tuning & Optimization Tools & Performance Case Study: the mkFit Particle Tracking Code",
                "Machine Learning: Introduction to Machine Learning, Decision Trees (Savannah Thais)",
                "Adrian Pol - Machine Learning: Introduction to Deep Learning, Convolutional Neural Networks"]
  }
  var questions_days = ["",
                        "How well did this match your interests",
                        "Quality of material and presentation",
                        "Difficulty/Level of Material",
                        "Comments (Optional)"];
  var question_types_days = ["addSectionHeaderItem","addScaleItem","addScaleItem",
                             "addMultipleChoiceItem","addParagraphTextItem"];
  
  // Given the list of lectures and questions, we make all combos
  //for (var counter = 0; counter < days.length; counter++) {
  //  var day = days[counter];
  days.forEach(function(day) {
    var lectures_today = lectures[day];
    questions[day]=[];
    question_types[day]=[]
    lectures_today.forEach(function(lecture) {
      questions_days.forEach(function(question) {
        questions[day].push(lecture+" - "+question);
        question_types[day].push(question_types_days[questions_days.indexOf(question)]);
      });
    });
  });
  
  // Now get the form and clear it
  var form = FormApp.getActiveForm();
  form.setTitle(form_name);
  var current_items = form.getItems();
  for (var counter=0; counter < current_items.length; counter++) {
    form.deleteItem(0);
  }

  //Loop over each section.  
  sections.forEach(function(section_name) {
    Logger.log(section_name);
    if ( sections.indexOf(section_name) == 0) {
      var section = form.addSectionHeaderItem();
      section.setTitle(titles[section_name]);
    }
    else {
      //Make a page break
      var section = form.addPageBreakItem();
      section.setTitle(titles[section_name]);
    }
    // Then loop over questions
    questions[section_name].forEach(function(question) {
      var index=questions[section_name].indexOf(question);
      var item = form[question_types[section_name][index]]();
      item.setTitle(question);
      Logger.log(question);
      //Determine if a question is required by its name
      if ( (item["setRequired"]) && (question.indexOf("Optional")==-1)) {
        item.setRequired(true);
      }
      //Apply question by question settings
      if ( settings[question_types[section_name][index]] ) {
        var commands = settings[question_types[section_name][index]];
        for (var key in commands) {
          var vals=commands[key];
          item[key](...vals);
        }
      }
    });
    
  });
}
