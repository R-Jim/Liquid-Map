package io.liquid.map.builder.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/statistic")
public class statisticController {

    @GetMapping(value = "")
    @ResponseBody
    public ModelAndView getDrawingBoard(ModelAndView modelAndView) {
        modelAndView.setViewName("statisticOverview.html");
        return modelAndView;
    }
}
