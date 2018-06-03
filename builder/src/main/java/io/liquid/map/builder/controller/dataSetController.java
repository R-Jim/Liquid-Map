package io.liquid.map.builder.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/data")
public class dataSetController {
    @GetMapping(value = "")
    @ResponseBody
    public ModelAndView getDrawingBoard(ModelAndView modelAndView) {
        modelAndView.setViewName("dataSet.html");
        return modelAndView;
    }
}

